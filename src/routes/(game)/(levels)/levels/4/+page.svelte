<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { fly, fade } from 'svelte/transition';
	import { RotateCcw } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { answers } from '$lib/levels/4/answers';

	let isPortrait = $state(true);
	let isMobile = $state(false);
	let showAnswerTab = $state(false);
	let helpUses = $state(1);
	let currentAnswerIndex = $state(0);
	let videoEnded = $state(false);
	let videoElement: HTMLVideoElement | null = $state(null);
	let autoplayPrevented = $state(false);

	function checkOrientation() {
		// Check if device is mobile
		const userAgent = navigator.userAgent.toLowerCase();
		isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);

		// Check if in portrait mode
		isPortrait = window.innerHeight > window.innerWidth;
	}

	function handleAnswerClick(optionId: string) {
		const currentAnswer = answers[currentAnswerIndex];
		const selectedOption = currentAnswer.options.find((opt) => opt.id === optionId);

		if (selectedOption?.correct) {
			showAnswerTab = false;
			if (currentAnswerIndex < answers.length - 1) {
				currentAnswerIndex++;
			}
		}
	}

	function replayVideo() {
		if (videoElement) {
			videoEnded = false;
			videoElement.currentTime = 0;
			videoElement.play();
		}
	}

	function handleVideoEnd() {
		videoEnded = true;
		showAnswerTab = true;
	}

	onMount(() => {
		checkOrientation();
	});

	$effect(() => {
		if (videoElement && answers[currentAnswerIndex]) {
			// Wait for video to be loaded and play
			videoElement.play().catch(() => {
				autoplayPrevented = true;
			});
		}
	});
</script>

<svelte:head>
	<title>Úroveň 4</title>
</svelte:head>

<svelte:window on:orientationchange={checkOrientation} on:resize={checkOrientation} />
<Layout2>
	<!-- Demo button -->
	{#if !isPortrait && isMobile}
		<Button
			onclick={() => (showAnswerTab = !showAnswerTab)}
			class="fixed top-4 left-4 z-50 flex items-center justify-center border-2 border-foreground bg-red-500 px-4 py-2 font-semibold hover:bg-red-500 active:bg-red-500"
		>
			Demo
		</Button>
	{/if}
	{#if isMobile && isPortrait}
		<div class="flex h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center">
			<div class="text-5xl">📱</div>
			<Paragraph className="text-xl font-semibold">
				Prosím otočte zařízení do vodorovné polohy
			</Paragraph>
		</div>
	{:else}
		<div class="flex w-full flex-col items-center justify-center landscape:gap-2">
			<!-- Desktop layout with video and help button side by side -->
			{#if !isMobile}
				<div class="relative w-full max-w-6xl">
					<div
						class="aspect-video overflow-hidden rounded-lg bg-transparent landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
					>
						{#if autoplayPrevented}
							<div class="flex h-full w-full items-center justify-center">
								<GameButton
									onclick={() => {
										autoplayPrevented = false;
										if (videoElement) {
											videoElement.play();
										}
									}}
								>
									Začít
								</GameButton>
							</div>
						{:else}
							{#key answers[currentAnswerIndex].videoSrc}
								<video
									bind:this={videoElement}
									class="h-full w-full object-cover"
									playsinline
									muted
									transition:fade={{ duration: 400 }}
									onended={handleVideoEnd}
								>
									<source src={answers[currentAnswerIndex].videoSrc} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							{/key}
						{/if}
					</div>
					<!-- Help button for desktop - absolute positioned -->
					<div class="absolute top-4 right-4">
						<div class="relative">
							<button
								onclick={replayVideo}
								disabled={!videoEnded}
								class="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-0 transition-all {videoEnded
									? 'bg-blue-500 shadow-[0_6px_0_rgb(29,78,216)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgb(29,78,216)] active:translate-y-0.5 active:shadow-[0_4px_0_rgb(29,78,216)]'
									: 'bg-gray-500 shadow-[0_6px_0_rgb(55,65,81)]'}"
							>
								<RotateCcw size={40} color="white" />
							</button>
							<div
								class="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-black"
							>
								<span class="text-xs font-bold text-white">{helpUses}</span>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Mobile layout with video only -->
			{#if isMobile}
				<div
					class="aspect-video w-full max-w-6xl overflow-hidden rounded-lg bg-transparent landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
				>
					{#if autoplayPrevented}
						<div class="flex h-full w-full items-center justify-center">
							<GameButton
								onclick={() => {
									autoplayPrevented = false;
									if (videoElement) {
										videoElement.play();
									}
								}}
							>
								Začít
							</GameButton>
						</div>
					{:else}
						{#key answers[currentAnswerIndex].videoSrc}
							<video
								bind:this={videoElement}
								class="h-full w-full object-cover"
								playsinline
								muted
								transition:fade={{ duration: 400 }}
								onended={handleVideoEnd}
							>
								<source src={answers[currentAnswerIndex].videoSrc} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						{/key}
					{/if}
				</div>
			{/if}
			{#if !isMobile && videoEnded}
				<div class="mt-4 flex w-full max-w-6xl flex-col gap-4" in:fly={{ y: 300, duration: 400 }}>
					{#each answers[currentAnswerIndex].options as option (option.id)}
						<GameButton size="small" onclick={() => handleAnswerClick(option.id)}>
							{option.text}
						</GameButton>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
	{#if isMobile && !isPortrait}
		<div class="relative">
			<button
				onclick={replayVideo}
				disabled={!videoEnded}
				class="fixed right-4 bottom-4 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-0 transition-all {videoEnded
					? 'bg-blue-500 shadow-[0_6px_0_rgb(29,78,216)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgb(29,78,216)] active:translate-y-0.5 active:shadow-[0_4px_0_rgb(29,78,216)]'
					: 'bg-gray-500 shadow-[0_6px_0_rgb(55,65,81)]'}"
			>
				<RotateCcw size={40} color="white" />
			</button>
			<div
				class="fixed right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-black"
			>
				<span class="text-xs font-bold text-white">{helpUses}</span>
			</div>
		</div>
	{/if}
	<!-- Answer tab -->
	{#if showAnswerTab && !isPortrait && isMobile}
		<div
			class="fixed inset-0 z-30 bg-black/30"
			onclick={() => (showAnswerTab = false)}
			role="presentation"
		></div>
		<div
			class="fixed right-0 bottom-0 left-0 z-40 flex flex-col gap-4 border-t-2 border-foreground bg-white p-4"
			in:fly={{ y: 300, duration: 400 }}
		>
			{#each answers[currentAnswerIndex].options as option (option.id)}
				<GameButton size="small" onclick={() => handleAnswerClick(option.id)}>
					{option.text}
				</GameButton>
			{/each}
		</div>
	{/if}
</Layout2>
