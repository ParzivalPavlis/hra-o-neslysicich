<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';

	type Phase = 'playing' | 'done' | 'failure';

	const totalRounds = Math.floor(Math.random() * 4) + 4; // 4–7, not shown
	let round = $state(0);
	let phase = $state<Phase>('playing');
	let windowOpen = $state(false); // true during the 1s vibration window
	let failTimeout: ReturnType<typeof setTimeout> | null = null;
	let nextTimeout: ReturnType<typeof setTimeout> | null = null;

	function scheduleNext() {
		const delay = 1500 + Math.random() * 2000;
		nextTimeout = setTimeout(triggerVibration, delay);
	}

	function triggerVibration() {
		if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
			navigator.vibrate(500);
		}
		windowOpen = true;
		failTimeout = setTimeout(() => {
			if (windowOpen) {
				windowOpen = false;
				phase = 'failure';
			}
		}, 1000);
	}

	function handlePress() {
		if (phase !== 'playing') return;
		if (!windowOpen) {
			phase = 'failure';
			return;
		}
		if (failTimeout !== null) { clearTimeout(failTimeout); failTimeout = null; }
		windowOpen = false;
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
		windowOpen = false;
		scheduleNext();
	}

	$effect(() => {
		scheduleNext();
		return () => {
			if (failTimeout !== null) clearTimeout(failTimeout);
			if (nextTimeout !== null) clearTimeout(nextTimeout);
		};
	});
</script>

<div class="flex h-dvh w-full flex-col items-center justify-center gap-10 bg-white p-8 select-none">
	<div class="text-center">
		<div class="mb-2 text-5xl">📳</div>
		<h1 class="text-2xl font-bold text-gray-800">Cítíš vibrace?</h1>
		<p class="mt-2 text-sm text-gray-500">Stiskni tlačítko, když zacítíš vibrace.</p>
	</div>

	{#if phase === 'playing'}
		<GameButton onclick={handlePress} size="large">Stiskni!</GameButton>

	{:else if phase === 'done'}
		<div class="flex flex-col items-center gap-6 text-center">
			<div class="text-6xl">✅</div>
			<p class="text-xl font-bold text-green-600">Výborně! Zvládl jsi všechna kola.</p>
			<GameButton onclick={() => goto('/levels/9/game')}>Zpět do kavárny</GameButton>
		</div>

	{:else if phase === 'failure'}
		<div class="flex flex-col items-center gap-6 text-center">
			<div class="text-6xl">❌</div>
			<p class="text-xl font-bold text-red-500">
				{windowOpen === false && round === 0 ? 'Příliš pozdě!' : 'Nesprávný čas!'}
			</p>
			<GameButton onclick={restart}>Zkusit znovu</GameButton>
			<GameButton variant={4} onclick={() => goto('/levels/9/game')}>Zpět do kavárny</GameButton>
		</div>
	{/if}
</div>
