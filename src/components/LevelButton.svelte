<script lang="ts">
	import { Button } from '$components/ui/button';
	import LevelTrail from '$components/LevelTrail.svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { Lock } from '@lucide/svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import type { ButtonVariantType, LevelButtonType } from '$types/levelButton';
	import { clearFirstThreeStars, clearJustUnlockedLevel } from '$lib/stores/lastPlayed';

	// Animation timing constants
	const CIRCLE_ANIMATION_DURATION = 800;
	const TOTAL_ANIMATION_DURATION = 2000;
	const CIRCLE_RADIUS = 95;
	const CIRCUMFERENCE_VALUE = 2 * Math.PI * CIRCLE_RADIUS;

	let {
		attributes,
		playYellowAnimation,
		playUnlockAnimation
	}: { attributes: LevelButtonType; playYellowAnimation?: boolean; playUnlockAnimation?: boolean } =
		$props();

	let clickCount = $state(0);
	let isPlayingYellow = $state(false);
	let isPlayingUnlock = $state(false);
	const IconComponent = $derived(attributes.icon);

	const variantClasses: Record<ButtonVariantType, string> = {
		blue: 'hover:bg-secondary bg-secondary shadow-[0_8px_0_var(--secondary-2)] hover:shadow-[0_10px_0_var(--secondary-2)] active:shadow-[0_4px_0_var(--secondary-2)]',
		gray: 'hover:bg-gray-500 bg-gray-500 shadow-[0_8px_0_rgb(55,65,81)] hover:shadow-[0_10px_0_rgb(55,65,81)] active:shadow-[0_4px_0_rgb(55,65,81)]',
		green:
			'hover:bg-green-500 bg-green-500 shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_10px_0_rgb(21,128,61)] active:shadow-[0_4px_0_rgb(21,128,61)]',
		yellow:
			'hover:bg-yellow-500 bg-yellow-500 shadow-[0_8px_0_rgb(161,98,7)] hover:shadow-[0_10px_0_rgb(161,98,7)] active:shadow-[0_4px_0_rgb(161,98,7)]'
	};

	const variant = $derived(
		attributes.locked
			? 'gray'
			: attributes.stars === 3
				? 'yellow'
				: attributes.stars > 0
					? 'green'
					: 'blue'
	);

	const strokeDasharray = $derived(
		`${(attributes.stars / 3) * CIRCUMFERENCE_VALUE} ${CIRCUMFERENCE_VALUE}`
	);

	function handleClick(e: MouseEvent, node: HTMLElement) {
		if (clickCount === 1 && !node.contains(e.target as Node)) {
			clickCount = 0;
		}
	}

	function clickOutside(node: HTMLElement) {
		document.addEventListener('click', (e) => handleClick(e, node));
		return {
			destroy() {
				document.removeEventListener('click', (e) => handleClick(e, node));
			}
		};
	}

	function triggerYellowAnimation() {
		isPlayingYellow = true;

		setTimeout(() => {
			// Add circle animation here if needed
		}, CIRCLE_ANIMATION_DURATION);

		setTimeout(() => {
			isPlayingYellow = false;
		}, TOTAL_ANIMATION_DURATION);
	}

	function triggerUnlockAnimation() {
		isPlayingUnlock = true;

		setTimeout(() => {
			isPlayingUnlock = false;
			clearJustUnlockedLevel();
		}, 1000);
	}

	// Track previous values to detect when animations change to true
	let prevPlayYellowAnimation = $state(false);
	let prevPlayUnlockAnimation = $state(false);

	$effect(() => {
		// Trigger yellow animation when playYellowAnimation changes from false to true
		if (playYellowAnimation && !prevPlayYellowAnimation && attributes.stars === 3) {
			triggerYellowAnimation();
			clearFirstThreeStars();
		}
		prevPlayYellowAnimation = playYellowAnimation ?? false;
	});

	$effect(() => {
		// Trigger unlock animation when playUnlockAnimation changes from false to true
		if (playUnlockAnimation && !prevPlayUnlockAnimation) {
			triggerUnlockAnimation();
		}
		prevPlayUnlockAnimation = playUnlockAnimation ?? false;
	});
</script>

<div
	id="level-{attributes.level}"
	class="relative z-20 flex h-96 w-full max-w-64 flex-col items-center"
	use:clickOutside
>
	{#if !attributes.locked && attributes.stars < 3 && !isPlayingYellow}
		<svg
			class="pointer-events-none absolute -top-4 left-1/2 z-10 h-62 w-62 -translate-x-1/2"
			viewBox="0 0 200 200"
		>
			<circle cx="100" cy="100" r="96" fill="none" stroke="rgb(209, 213, 219)" stroke-width="6" />
			{#if attributes.stars > 0}
				<circle
					cx="100"
					cy="100"
					r="96"
					fill="none"
					stroke="rgb(234, 179, 8)"
					stroke-width="6"
					stroke-dasharray={strokeDasharray}
					stroke-linecap="round"
					class="transition-all duration-300"
					style="transform-origin: 100px 100px; transform: rotate(-90deg);"
				/>
			{/if}
		</svg>
	{/if}

	{#if isPlayingYellow}
		<svg
			class="pointer-events-none absolute -top-4 left-1/2 z-10 h-62 w-62 -translate-x-1/2"
			viewBox="0 0 200 200"
		>
			<circle cx="100" cy="100" r="96" fill="none" stroke="rgb(209, 213, 219)" stroke-width="6" />
			<circle
				cx="100"
				cy="100"
				r="96"
				fill="none"
				stroke="rgb(234, 179, 8)"
				stroke-width="6"
				stroke-linecap="round"
				class="animate-circle-complete"
				style="transform-origin: 100px 100px; transform: rotate(-90deg); stroke-dasharray: 0 {CIRCUMFERENCE_VALUE} {CIRCUMFERENCE_VALUE};"
			/>
		</svg>
	{/if}

	<div
		class={isPlayingYellow ? 'animate-celebrate' : isPlayingUnlock ? 'animate-unlock-level' : ''}
	>
		<Button
			type="button"
			disabled={attributes.locked}
			onclick={() => {
				clickCount++;
				if (clickCount === 2) {
					goto(attributes.href);
				}
			}}
			class={cn(
				'group relative flex h-52 w-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full hover:-translate-y-0.5 hover:opacity-100 active:translate-y-1',
				!isPlayingYellow && !isPlayingUnlock && 'transition-all',
				isPlayingYellow ? variantClasses['yellow'] : variantClasses[variant]
			)}
		>
			{#if variant === 'yellow' || isPlayingYellow}
				<div
					class="absolute inset-0 rounded-full opacity-30"
					style="background: repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(120, 53, 15, 0.2) 50px, rgba(120, 53, 15, 0.2) 80px);"
				></div>
			{/if}
			<div class="relative z-10 flex flex-col items-center gap-2">
				<div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white">
					{#if attributes.locked}
						<Lock class="h-7 w-7" />
					{:else}
						<IconComponent class="h-7 w-7" />
					{/if}
				</div>
				<div
					class="relative flex h-8 items-center justify-center text-2xl font-extrabold text-white uppercase drop-shadow"
				>
					{#if clickCount > 0}
						<span class="absolute whitespace-nowrap" transition:fade={{ duration: 150 }}>
							ZAČÍT
						</span>
					{:else}
						<span class="absolute whitespace-nowrap" transition:fade={{ duration: 150 }}>
							Úroveň {attributes.level}
						</span>
					{/if}
					{#if clickCount > 0}
						<span
							class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap"
							transition:fade={{ duration: 150 }}>(Klikněte znovu)</span
						>
					{/if}
				</div>
			</div>
		</Button>
	</div>

	{#if clickCount === 1}
		<!-- Double-click to navigate: first click shows hint, second click navigates -->
		<div
			class="chat-bubble border-gray/20 mt-10 w-full rounded-lg border-3 bg-white px-4 py-3"
			style="z-index: inherit;"
		>
			<Paragraph className="text-center leading-relaxed">{attributes.description}</Paragraph>
			<p class="text-center text-sm leading-relaxed text-foreground"></p>
		</div>
	{/if}

	{#if attributes.trails}
		<LevelTrail variant={attributes.trails} />
	{/if}
</div>

<style>
	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes animateCircle {
		to {
			stroke-dasharray: 604 604;
		}
	}

	@keyframes celebrate {
		0% {
			transform: scale(1);
		}
		15% {
			transform: scale(1.25);
		}
		35% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.12);
		}
		70% {
			transform: scale(1);
		}
		85% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes unlockLevel {
		0% {
			transform: scale(1);
		}
		15% {
			transform: scale(1.25);
		}
		35% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.12);
		}
		70% {
			transform: scale(1);
		}
		85% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	.chat-bubble {
		animation: slideInUp 0.4s ease-out;
	}

	.animate-circle-complete {
		animation: animateCircle 0.8s linear forwards !important;
	}

	.animate-celebrate {
		animation: celebrate 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards !important;
		transform-origin: center !important;
	}

	.animate-unlock-level {
		animation: unlockLevel 1s ease-in-out forwards !important;
	}
</style>
