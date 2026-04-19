<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import PortraitOrientationWarning from '$components/PortraitOrientationWarning.svelte';
	import { getOrientationInfo } from '$lib/client/shared/gameUtils';
	import { preventHorizontalScroll } from '$lib/client/shared/walkingUtils';
	import { Vibrate, Hand } from '@lucide/svelte';

	type Phase = 'playing' | 'done' | 'failure';

	const CURRENT_LEVEL_NUMBER = 9;
	const totalRounds = Math.floor(Math.random() * 4) + 4;

	let round = $state(0);
	let phase = $state<Phase>('playing');
	let buttonVisible = $state(false);
	let buttonX = $state(50);
	let buttonY = $state(50);
	let isVibrating = $state(false);
	let isLandscape = $state(false);
	let isMobile = $state(false);
	let hideTimeout: ReturnType<typeof setTimeout> | null = null;
	let nextTimeout: ReturnType<typeof setTimeout> | null = null;

	function scheduleNext() {
		const delay = 1000 + Math.random() * 2000;
		nextTimeout = setTimeout(showButton, delay);
	}

	function showButton() {
		buttonX = 15 + Math.random() * 70;
		buttonY = 20 + Math.random() * 60;

		isVibrating = Math.random() > 0.4;

		if (isVibrating && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
			navigator.vibrate(400);
		}

		buttonVisible = true;

		hideTimeout = setTimeout(() => {
			if (buttonVisible) {
				buttonVisible = false;
				if (isVibrating) {
					phase = 'failure'; // missed a vibration
				} else {
					scheduleNext(); // correctly ignored non-vibrating button
				}
			}
		}, 1200);
	}

	function handlePress() {
		if (phase !== 'playing' || !buttonVisible) return;
		if (hideTimeout !== null) {
			clearTimeout(hideTimeout);
			hideTimeout = null;
		}
		buttonVisible = false;

		if (!isVibrating) {
			phase = 'failure';
			return;
		}

		round += 1;
		if (round >= totalRounds) {
			phase = 'done';
		} else {
			scheduleNext();
		}
	}

	function restart() {
		round = 0;
		phase = 'playing';
		buttonVisible = false;
		isVibrating = false;
		scheduleNext();
	}

	const gameActive = $derived(!isMobile || !isLandscape);

	function updateOrientation() {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
		isLandscape = !orientation.isPortrait;
	}

	$effect(() => {
		updateOrientation();
	});

	$effect(() => {
		if (!gameActive) {
			if (hideTimeout !== null) {
				clearTimeout(hideTimeout);
				hideTimeout = null;
			}
			if (nextTimeout !== null) {
				clearTimeout(nextTimeout);
				nextTimeout = null;
			}
			buttonVisible = false;
			return;
		}
		scheduleNext();
		return () => {
			if (hideTimeout !== null) clearTimeout(hideTimeout);
			if (nextTimeout !== null) clearTimeout(nextTimeout);
		};
	});
</script>

<svelte:window
	onresize={updateOrientation}
	onorientationchange={updateOrientation}
	onwheel={preventHorizontalScroll}
/>

{#if isMobile && isLandscape}
	<PortraitOrientationWarning mode="portrait" />
{:else}
	<div class="relative flex h-dvh w-full overflow-hidden bg-white select-none">
		{#if phase === 'playing'}
			<div
				class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
			>
				<Vibrate class="text-gray-300" size={48} />
				<h1 class="text-2xl font-bold text-gray-800">Cítíš vibrace?</h1>
				<p class="text-sm text-gray-400">Stiskni tlačítko jen když zacítíš vibrace.</p>
			</div>
		{/if}
		{#if phase === 'playing' && buttonVisible}
			<div
				class="absolute -translate-x-1/2 -translate-y-1/2"
				style="left: {buttonX}%; top: {buttonY}%"
			>
				<button
					onclick={handlePress}
					class="flex h-18 w-18 cursor-pointer items-center justify-center rounded-full bg-secondary shadow-[0_6px_0_var(--secondary-2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--secondary-2)] active:translate-y-0.5 active:shadow-[0_4px_0_var(--secondary-2)]"
				>
					<Hand size={40} color="white" />
				</button>
			</div>
		{/if}
		{#if phase === 'done'}
			<div
				class="absolute inset-0 mx-auto flex w-full max-w-150 flex-col items-center justify-center gap-6 p-8 text-center"
			>
				<p class="text-xl font-bold text-green-600">Výborně! Zvládl jsi všechna kola.</p>
				<GameButton class="w-full" onclick={() => goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`)}>
					Zpět
				</GameButton>
			</div>
		{/if}
		{#if phase === 'failure'}
			<div
				class="absolute inset-0 mx-auto flex w-full max-w-150 flex-col items-center justify-center gap-6 p-8 text-center"
			>
				<p class="text-xl font-bold text-red-500">
					{isVibrating ? 'Nestiskl jsi včas!' : 'Telefon nevibrovalo!'}
				</p>
				<GameButton class="w-full" onclick={restart}>Zkusit znovu</GameButton>
				<GameButton
					class="w-full"
					variant={4}
					onclick={() => goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`)}
				>
					Zpět
				</GameButton>
			</div>
		{/if}
	</div>
{/if}
