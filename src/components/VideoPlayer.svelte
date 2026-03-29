<script lang="ts">
	import ReplayButton from './ReplayButton.svelte';
	import { Play } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		videoSrc: string;
		videoEnded?: boolean;
		autoplayPrevented?: boolean;
		helpUses?: number;
		showSkipButton?: boolean;
		onReplay?: () => void;
		onVideoEnd?: () => void;
		onPlayClick?: () => void;
	}

	let {
		videoSrc,
		videoEnded = $bindable(false),
		autoplayPrevented = $bindable(false),
		helpUses = 3,
		showSkipButton = false,
		onReplay,
		onVideoEnd,
		onPlayClick
	}: Props = $props();

	let videoElement: HTMLVideoElement | null = $state(null);

	function handlePlayClick() {
		autoplayPrevented = false;
		if (videoElement) {
			videoElement.play();
		}
		onPlayClick?.();
	}

	function handleVideoEnd() {
		videoEnded = true;
		onVideoEnd?.();
	}

	function handleReplay() {
		videoEnded = false;
		if (videoElement) {
			videoElement.currentTime = 0;
			videoElement.play();
		}
		onReplay?.();
	}

	function handleSkip() {
		if (videoElement) {
			videoElement.currentTime = videoElement.duration;
		}
	}

	$effect(() => {
		if (videoElement && videoSrc) {
			videoElement.play().catch(() => {
				autoplayPrevented = true;
			});
		}
	});
</script>

{#if showSkipButton}
	<button
		onclick={handleSkip}
		class="fixed top-4 left-4 z-50 flex items-center justify-center border-2 border-foreground bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 active:bg-red-600"
	>
		Skip
	</button>
{/if}

{#if autoplayPrevented}
	<div class="flex h-full w-full items-center justify-center">
		<button
			onclick={handlePlayClick}
			class="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-0 bg-secondary shadow-[0_6px_0_var(--secondary-2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--secondary-2)] active:translate-y-0.5 active:shadow-[0_4px_0_var(--secondary-2)]"
		>
			<Play size={24} color="white" fill="white" />
		</button>
	</div>
{:else}
	{#key videoSrc}
		<video
			bind:this={videoElement}
			class="h-full w-full object-cover transition-opacity duration-300 {videoEnded
				? 'opacity-50'
				: 'opacity-100'}"
			playsinline
			muted
			transition:fade={{ duration: 400 }}
			onended={handleVideoEnd}
		>
			<source src={videoSrc} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	{/key}
	{#if videoEnded}
		<div
			class="absolute inset-0 flex items-center justify-center"
			transition:fade={{ duration: 200 }}
		>
			<ReplayButton onclick={handleReplay} disabled={helpUses === 0} {helpUses} />
		</div>
	{/if}
{/if}
