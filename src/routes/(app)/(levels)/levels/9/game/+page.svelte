<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { level9 } from '$lib/stores/gameState';
	import WalkingMan from '$components/WalkingMan.svelte';
	import ClickableObject from '$components/ClickableObject.svelte';
	import ClickIndicator from '$components/ClickIndicator.svelte';
	import PortraitOrientationWarning from '$components/PortraitOrientationWarning.svelte';
	import { getOrientationInfo } from '$lib/client/shared/gameUtils';

	type GameEvent = {
		title: string;
		emoji: string;
		lines: string[];
		isExit?: boolean;
	};

	type SceneObject = {
		id: string;
		worldX: number;
		label: string;
		imageSrc?: string;
		event: GameEvent;
	};

	const WALK_SPEED = 4; // px per animation frame (~150px/s at 60fps)
	const CAMERA_LOCK_RATIO = 0.33; // character locks at 33% of screen width
	const INTERACT_DISTANCE = 80; // px in world space to trigger event
	const WORLD_WIDTH = 4000; // px — total scrollable world length

	const sceneObjects: SceneObject[] = [
		{
			id: 'menu',
			worldX: 300,
			label: 'Jídelní lístek',
			imageSrc: '',
			event: {
				title: 'Vizuální menu',
				emoji: '📋',
				lines: [
					'Kavárna má vizuální menu s fotografiemi jídel a nápojů.',
					'Neslyšící zákazníci si mohou vybrat bez nutnosti mluvit.',
					'QR kódy na stolech vedou na digitální menu přímo v telefonu.'
				]
			}
		},
		{
			id: 'barista',
			worldX: 700,
			label: 'Barista',
			imageSrc: '',
			event: {
				title: 'Objednávka bez slov',
				emoji: '✍️',
				lines: [
					'Barista má připravený zápisník pro psanou komunikaci.',
					'Jednoduché gesto nebo napsaná objednávka stačí.',
					'Profesionální podniky školí zaměstnance v základní znakové řeči.'
				]
			}
		},
		{
			id: 'app',
			worldX: 1100,
			label: 'Přepis řeči',
			imageSrc: '',
			event: {
				title: 'Aplikace pro přepis',
				emoji: '📱',
				lines: [
					'Aplikace jako Google Live Transcribe převádí mluvené slovo na text.',
					'Neslyšící mohou číst, co říkají lidé kolem nich, v reálném čase.',
					'Stačí položit telefon na stůl a sledovat text na obrazovce.'
				]
			}
		},
		{
			id: 'light',
			worldX: 1500,
			label: 'Světelný signál',
			imageSrc: '',
			event: {
				title: 'Vizuální upozornění',
				emoji: '💡',
				lines: [
					'Místo akustického zvonku kavárna používá blikající světelné signály.',
					'Vibrace v hodinkách nebo telefonu upozorní neslyšícího zákazníka.',
					'Vibrační pagery jsou běžné v moderních restauracích a kavárnách.'
				]
			}
		},
		{
			id: 'exit',
			worldX: 1900,
			label: 'Odejít z kavárny',
			imageSrc: '',
			event: {
				title: 'Výborně!',
				emoji: '🎉',
				lines: [
					'Prozkoumali jste celou kavárnu!',
					'Dobře přizpůsobená místa jsou přístupná všem – slyšícím i neslyšícím.',
					'Pomohli jste Tomášovi strávit příjemné odpoledne v kavárně.'
				],
				isExit: true
			}
		}
	];

	const requiredIds = sceneObjects.filter((o) => !o.event.isExit).map((o) => o.id);

	let isPortrait = $state(true);
	let isMobile = $state(false);

	let charWorldX = $state(50);
	let screenWidth = $state(375);
	let isWalking = $state(false);
	let facingRight = $state(false);
	let walkDir = $state<'left' | 'right' | null>(null);
	let activeEvent = $state<GameEvent | null>(null);
	let visitedObjects = $state(new Set<string>());

	const cameraLockPx = $derived(screenWidth * CAMERA_LOCK_RATIO);
	const worldOffset = $derived(Math.max(0, charWorldX - cameraLockPx));
	const charScreenX = $derived(Math.min(charWorldX, cameraLockPx));
	const canExit = $derived(requiredIds.every((id) => visitedObjects.has(id)));

	let clickIndicatorWorldX = $state<number | null>(null);
	const clickIndicatorScreenX = $derived(
		clickIndicatorWorldX !== null ? clickIndicatorWorldX - worldOffset : null
	);

	let animFrameId: number | null = null;
	let targetWorldX: number | null = null;
	let targetObjectId: string | null = null;

	function updateOrientation() {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
		isPortrait = orientation.isPortrait;
	}

	function animate() {
		if (!walkDir) return;

		charWorldX =
			walkDir === 'right'
				? Math.min(WORLD_WIDTH, charWorldX + WALK_SPEED)
				: Math.max(0, charWorldX - WALK_SPEED);

		// Stop at background click position
		if (targetWorldX !== null) {
			const reached = walkDir === 'right' ? charWorldX >= targetWorldX : charWorldX <= targetWorldX;
			if (reached) {
				charWorldX = targetWorldX;
				targetWorldX = null;
				clickIndicatorWorldX = null;
				stopWalking();
				return;
			}
		}

		// Stop at targeted object
		if (targetObjectId) {
			const target = sceneObjects.find((o) => o.id === targetObjectId);
			if (target && Math.abs(charWorldX - target.worldX) < INTERACT_DISTANCE) {
				stopWalking();
				targetObjectId = null;
				visitedObjects = new Set([...visitedObjects, target.id]);
				activeEvent = target.event;
				return;
			}
		}

		animFrameId = requestAnimationFrame(animate);
	}

	function startWalking(dir: 'left' | 'right') {
		walkDir = dir;
		isWalking = true;
		facingRight = dir === 'right';
		if (animFrameId !== null) cancelAnimationFrame(animFrameId);
		animFrameId = requestAnimationFrame(animate);
	}

	function stopWalking() {
		walkDir = null;
		isWalking = false;
		if (animFrameId !== null) {
			cancelAnimationFrame(animFrameId);
			animFrameId = null;
		}
	}

	function handleBackgroundClick(e: MouseEvent) {
		if (activeEvent) return;
		const clickWorldX = e.clientX + worldOffset;
		if (Math.abs(clickWorldX - charWorldX) < 5) return;
		targetObjectId = null;
		targetWorldX = Math.min(WORLD_WIDTH, clickWorldX);
		clickIndicatorWorldX = Math.min(WORLD_WIDTH, clickWorldX);
		startWalking(clickWorldX > charWorldX ? 'right' : 'left');
	}

	function handleObjectClick(obj: SceneObject) {
		if (activeEvent) return;
		if (obj.event.isExit && !canExit) return;
		targetWorldX = null;
		clickIndicatorWorldX = null;
		targetObjectId = obj.id;
		startWalking(charWorldX < obj.worldX ? 'right' : 'left');
	}

	function closeEvent() {
		const isExiting = activeEvent?.isExit;
		activeEvent = null;
		if (isExiting) {
			level9.markCompleted();
			goto('/levels/9/overview');
		}
	}

	onMount(() => {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
		isPortrait = orientation.isPortrait;

		screenWidth = window.innerWidth;
		const onResize = () => {
			screenWidth = window.innerWidth;
		};
		window.addEventListener('resize', onResize);

		const heldKeys = new Set<string>();

		const onKeyDown = (e: KeyboardEvent) => {
			if (activeEvent) return;
			const isLeft = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A';
			const isRight = e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D';
			if (!isLeft && !isRight) return;
			e.preventDefault();
			heldKeys.add(e.key);
			targetWorldX = null;
			targetObjectId = null;
			clickIndicatorWorldX = null;
			if (isRight) startWalking('right');
			else startWalking('left');
		};

		const onKeyUp = (e: KeyboardEvent) => {
			heldKeys.delete(e.key);
			const leftHeld = heldKeys.has('ArrowLeft') || heldKeys.has('a') || heldKeys.has('A');
			const rightHeld = heldKeys.has('ArrowRight') || heldKeys.has('d') || heldKeys.has('D');
			if (rightHeld) startWalking('right');
			else if (leftHeld) startWalking('left');
			else stopWalking();
		};

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);

		return () => {
			window.removeEventListener('resize', onResize);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			if (animFrameId !== null) cancelAnimationFrame(animFrameId);
		};
	});
</script>

<svelte:window on:orientationchange={updateOrientation} on:resize={updateOrientation} />
{#if isMobile && isPortrait}
	<PortraitOrientationWarning />
{:else}
	<div class="relative h-dvh w-full overflow-hidden bg-white select-none md:mr-10 md:ml-10">
		<button
			class="absolute inset-0 z-0 cursor-pointer opacity-0"
			aria-label="Herní scéna"
			onclick={handleBackgroundClick}
		></button>
		<div
			class="pointer-events-none absolute inset-0 z-10"
			style="transform: translateX({-worldOffset}px)"
		>
			<div
				class="absolute bottom-0 left-0 h-7 bg-black md:h-10 lg:bottom-25"
				style="width: {WORLD_WIDTH}px"
			></div>
			{#each sceneObjects as obj}
				{@const isDisabled = obj.event.isExit && !canExit}
				<div
					class="pointer-events-auto absolute bottom-7 lg:bottom-27"
					style="left: {obj.worldX}px; transform: translateX(-50%)"
				>
					<ClickableObject
						imageSrc={obj.imageSrc || undefined}
						label={obj.label}
						visited={visitedObjects.has(obj.id)}
						disabled={isDisabled}
						onclick={() => handleObjectClick(obj)}
					/>
				</div>
			{/each}
		</div>
		<div
			class="pointer-events-none absolute bottom-3 z-20 lg:bottom-27"
			style="left: {charScreenX}px; transform: translateX(-50%)"
		>
			<WalkingMan {facingRight} {isWalking} />
		</div>
		{#if clickIndicatorScreenX !== null}
			<ClickIndicator screenX={clickIndicatorScreenX} />
		{/if}
		{#if activeEvent}
			<div
				class="absolute inset-0 z-40 flex cursor-default items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
			>
				<div class="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
					<div class="mb-3 text-center text-6xl">{activeEvent.emoji}</div>
					<h2 class="mb-4 text-center text-xl font-bold text-gray-800">{activeEvent.title}</h2>
					<div class="mb-6 space-y-2">
						{#each activeEvent.lines as line}
							<p class="text-sm leading-relaxed text-gray-600">• {line}</p>
						{/each}
					</div>
					<button
						class="w-full cursor-pointer rounded-xl bg-[#0992c2] py-3 font-bold text-white transition-colors hover:bg-[#0779a8]"
						onclick={closeEvent}
					>
						{activeEvent.isExit ? '🎉 Dokončit úroveň' : 'Rozumím ✓'}
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
