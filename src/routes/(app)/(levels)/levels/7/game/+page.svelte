<script lang="ts">
	import { goto } from '$app/navigation';
	import { level7 } from '$lib/stores/gameState';
	import WalkingMan from '$components/WalkingMan.svelte';
	import ClickableObject from '$components/ClickableObject.svelte';
	import ClickIndicator from '$components/ClickIndicator.svelte';
	import PortraitOrientationWarning from '$components/PortraitOrientationWarning.svelte';
	import GameEventModal from '$components/GameEventModal.svelte';
	import { getOrientationInfo } from '$lib/client/shared/gameUtils';
	import {
		isLeftKey,
		isRightKey,
		preventHorizontalScroll,
		calcWorldOffset,
		calcCharScreenX
	} from '$lib/client/shared/walkingUtils';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	type GameEvent = {
		title: string;
		lines: string[];
		encounterHref?: string;
		isExit?: boolean;
	};

	type SceneObject = {
		id: string;
		worldX: number;
		label: string;
		imageSrc?: string;
		event: GameEvent;
	};

	const CURRENT_LEVEL_NUMBER = 7;
	const WALK_SPEED = 4; // px per animation frame (~150px/s at 60fps)
	const CAMERA_LOCK_RATIO = 0.33; // character locks at 33% of screen width
	const INTERACT_DISTANCE = 80; // px in world space to trigger event
	const WORLD_WIDTH = 4000; // px — total scrollable world length

	const sceneObjects: SceneObject[] = [
		{
			id: 'menu',
			worldX: 600,
			label: 'Vstávání',
			imageSrc: '/assets/level10/encounter1.png',
			event: {
				title: 'Vstávání',
				lines: [
					'Kavárna má vizuální menu s fotografiemi jídel a nápojů.',
					'Neslyšící zákazníci si mohou vybrat bez nutnosti mluvit.',
					'QR kódy na stolech vedou na digitální menu přímo v telefonu.'
				],
				encounterHref: `/levels/${CURRENT_LEVEL_NUMBER}/encounters/1`
			}
		},
		{
			id: 'barista',
			worldX: 1200,
			label: 'Barista',
			imageSrc: '',
			event: {
				title: 'Objednávka bez slov',
				lines: [
					'Barista má připravený zápisník pro psanou komunikaci.',
					'Jednoduché gesto nebo napsaná objednávka stačí.',
					'Profesionální podniky školí zaměstnance v základní znakové řeči.'
				],
				encounterHref: `/levels/${CURRENT_LEVEL_NUMBER}/encounters/2`
			}
		},
		{
			id: 'app',
			worldX: 1800,
			label: 'Přepis řeči',
			imageSrc: '',
			event: {
				title: 'Aplikace pro přepis',
				lines: [
					'Aplikace jako Google Live Transcribe převádí mluvené slovo na text.',
					'Neslyšící mohou číst, co říkají lidé kolem nich, v reálném čase.',
					'Stačí položit telefon na stůl a sledovat text na obrazovce.'
				],
				encounterHref: `/levels/${CURRENT_LEVEL_NUMBER}/encounters/3`
			}
		},
		{
			id: 'light',
			worldX: 2400,
			label: 'Světelný signál',
			imageSrc: '',
			event: {
				title: 'Vizuální upozornění',
				lines: [
					'Místo akustického zvonku kavárna používá blikající světelné signály.',
					'Vibrace v hodinkách nebo telefonu upozorní neslyšícího zákazníka.',
					'Vibrační pagery jsou běžné v moderních restauracích a kavárnách.'
				],
				encounterHref: `/levels/${CURRENT_LEVEL_NUMBER}/encounters/4`
			}
		},
		{
			id: 'exit',
			worldX: 3000,
			label: 'Odejít z kavárny',
			imageSrc: '',
			event: {
				title: 'Výborně!',
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
	let charWorldX = $state(get(level7.store).lastWorldX ?? 50);
	let screenWidth = $state(375);
	let isWalking = $state(false);
	let facingRight = $state(false);
	let walkDir = $state<'left' | 'right' | null>(null);
	let activeEvent = $state<GameEvent | null>(null);
	let visitedObjects = $state(new Set<string>());

	const cameraLockPx = $derived(screenWidth * CAMERA_LOCK_RATIO);
	const worldOffset = $derived(calcWorldOffset(charWorldX, cameraLockPx));
	const charScreenX = $derived(calcCharScreenX(charWorldX, cameraLockPx));
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
				visitedObjects.add(target.id);
				activeEvent = target.event;
				level7.savePosition(charWorldX);
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
		level7.savePosition(charWorldX);
	}

	function handleObjectClick(obj: SceneObject) {
		if (activeEvent) return;
		if (obj.event.isExit && !canExit) return;
		targetWorldX = null;
		clickIndicatorWorldX = null;
		targetObjectId = obj.id;
		startWalking(charWorldX < obj.worldX ? 'right' : 'left');
		level7.savePosition(charWorldX);
	}

	function closeEvent() {
		const isExiting = activeEvent?.isExit;
		activeEvent = null;
		if (isExiting) {
			level7.markCompleted();
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/overview`);
		}
	}

	const heldKeys = new Set<string>();

	function onResize() {
		screenWidth = window.innerWidth;
		updateOrientation();
	}

	function onKeyDown(e: KeyboardEvent) {
		if (activeEvent) return;
		const left = isLeftKey(e.key);
		const right = isRightKey(e.key);
		if (!left && !right) return;
		e.preventDefault();
		heldKeys.add(e.key);
		targetWorldX = null;
		targetObjectId = null;
		clickIndicatorWorldX = null;
		if (right) startWalking('right');
		else startWalking('left');
		level7.savePosition(charWorldX);
	}

	function onKeyUp(e: KeyboardEvent) {
		heldKeys.delete(e.key);
		const leftHeld = [...heldKeys].some(isLeftKey);
		const rightHeld = [...heldKeys].some(isRightKey);
		if (rightHeld) startWalking('right');
		else if (leftHeld) startWalking('left');
		else stopWalking();
		level7.savePosition(charWorldX);
	}

	function onWheel(e: WheelEvent) {
		preventHorizontalScroll(e);
	}

	$effect(() => {
		updateOrientation();
		screenWidth = window.innerWidth;

		return () => {
			if (animFrameId !== null) cancelAnimationFrame(animFrameId);
		};
	});

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
		updateOrientation();
		screenWidth = window.innerWidth;
		level7.initialize();
	});
</script>

<svelte:window
	onresize={onResize}
	onorientationchange={onResize}
	onkeydown={onKeyDown}
	onkeyup={onKeyUp}
	onwheel={onWheel}
/>
{#if isMobile && isPortrait}
	<PortraitOrientationWarning />
{:else}
	<div class="relative h-dvh w-full overflow-hidden bg-white select-none md:mr-10">
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
			<GameEventModal
				event={activeEvent}
				encounterHref={activeEvent.encounterHref}
				onclose={closeEvent}
			/>
		{/if}
	</div>
{/if}
