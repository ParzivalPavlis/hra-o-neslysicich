<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import ReplayButton from '$components/ReplayButton.svelte';
	import AnswerTab from '$components/AnswerTab.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { fly, fade } from 'svelte/transition';
	import { Play, HeartHandshake } from '@lucide/svelte';
	import { shuffleArray } from '$lib/shared/utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { answers } from '$lib/levels/4/answers';
	import type { AnswerOptionType } from '$types/answer';
	import {
		level4GameState,
		initializeLevel4Game,
		updateCurrentAnswer,
		decreaseLives,
		addAnswer
	} from '$lib/stores/level4';

	let isPortrait = $state(true);
	let isMobile = $state(false);
	let showAnswerTab = $state(false);
	let answerTabCollapsed = $state(false);
	let helpUses = $state(3);
	let videoEnded = $state(false);
	let videoElement: HTMLVideoElement | null = $state(null);
	let autoplayPrevented = $state(false);
	let shuffledOptions = $state<AnswerOptionType[]>([]);
	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);

	// Derived state from store
	let gameState = $derived($level4GameState);
	let currentAnswerIndex = $derived(gameState.currentAnswerIndex);
	let lives = $derived(gameState.lives);

	function updateOrientation() {
		const userAgent = navigator.userAgent.toLowerCase();
		isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
		isPortrait = window.innerHeight > window.innerWidth;
	}

	function handleAnswerClick(optionId: string) {
		if (showingFeedback) return;

		const currentAnswer = answers[currentAnswerIndex];
		const selectedOption = currentAnswer.options.find((opt) => opt.id === optionId);

		if (selectedOption) {
			selectedAnswer = optionId;
			isCorrect = selectedOption.correct;
			showingFeedback = true;

			// Record the answer in the store
			addAnswer(currentAnswerIndex, optionId, isCorrect);

			setTimeout(() => {
				if (isCorrect) {
					showAnswerTab = false;
					if (currentAnswerIndex < answers.length - 1) {
						updateCurrentAnswer(currentAnswerIndex + 1);
					} else {
						// Last question answered correctly - navigate to overview
						goto('/levels/4/overview');
					}
				} else {
					decreaseLives();
				}
				showingFeedback = false;
				selectedAnswer = null;
			}, 1500);
		}
	}

	function replayVideo() {
		if (helpUses > 0 && videoElement) {
			helpUses--;
			videoEnded = false;
			videoElement.currentTime = 0;
			videoElement.play();
		}
	}

	function skipVideo() {
		if (videoElement) {
			videoElement.currentTime = videoElement.duration;
		}
	}

	function handleVideoEnd() {
		videoEnded = true;
		showAnswerTab = true;
	}

	function showColorFeedback(optionId: string) {
		if (!showingFeedback || selectedAnswer !== optionId) return 1;
		return isCorrect ? 2 : 3;
	}

	onMount(() => {
		updateOrientation();
		initializeLevel4Game();
	});

	$effect(() => {
		videoEnded = false;
		if (videoElement && answers[currentAnswerIndex]) {
			// Wait for video to be loaded and play
			videoElement.play().catch(() => {
				autoplayPrevented = true;
			});
		}
		if (answers[currentAnswerIndex]) {
			shuffledOptions = shuffleArray(answers[currentAnswerIndex].options);
		}
	});
</script>

<svelte:head>
	<title>Úroveň 4</title>
</svelte:head>

<svelte:window on:orientationchange={updateOrientation} on:resize={updateOrientation} />
<Layout2>
	<!-- Skip button for mobile landscape -->
	{#if !isPortrait && isMobile}
		<button
			onclick={skipVideo}
			class="fixed top-4 left-4 z-50 flex items-center justify-center border-2 border-foreground bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 active:bg-red-600"
		>
			Skip
		</button>
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
						class="relative aspect-video overflow-hidden rounded-lg border-2 border-foreground bg-transparent landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
					>
						{#if autoplayPrevented}
							<div class="flex h-full w-full items-center justify-center">
								<button
									onclick={() => {
										autoplayPrevented = false;
										if (videoElement) {
											videoElement.play();
										}
									}}
									class="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-0 bg-secondary shadow-[0_6px_0_var(--secondary-2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--secondary-2)] active:translate-y-0.5 active:shadow-[0_4px_0_var(--secondary-2)]"
								>
									<Play size={24} color="white" fill="white" />
								</button>
							</div>
						{:else}
							{#key answers[currentAnswerIndex].videoSrc}
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
									<source src={answers[currentAnswerIndex].videoSrc} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							{/key}
							{#if videoEnded}
								<div
									class="absolute inset-0 flex items-center justify-center"
									transition:fade={{ duration: 200 }}
								>
									<ReplayButton onclick={replayVideo} disabled={helpUses === 0} {helpUses} />
								</div>
							{/if}
						{/if}
					</div>
					<!-- Lives indicator for desktop - absolute positioned -->
					<div class="absolute top-4 right-4 flex flex-col gap-2">
						{#each Array(4) as _, i}
							<HeartHandshake
								size={30}
								class="transition-all duration-500 {i < lives ? ' text-red-600' : 'text-gray-300'}"
							/>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Mobile layout with video only -->
			{#if isMobile}
				<div
					class="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg border-2 border-foreground bg-transparent landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
				>
					{#if autoplayPrevented}
						<div class="flex h-full w-full items-center justify-center">
							<button
								onclick={() => {
									autoplayPrevented = false;
									if (videoElement) {
										videoElement.play();
									}
								}}
								class="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-0 bg-secondary shadow-[0_6px_0_var(--secondary-2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--secondary-2)] active:translate-y-0.5 active:shadow-[0_4px_0_var(--secondary-2)]"
							>
								<Play size={24} color="white" fill="white" />
							</button>
						</div>
					{:else}
						{#key answers[currentAnswerIndex].videoSrc}
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
								<source src={answers[currentAnswerIndex].videoSrc} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						{/key}
						{#if videoEnded}
							<div
								class="absolute inset-0 flex items-center justify-center"
								transition:fade={{ duration: 200 }}
							>
								<ReplayButton onclick={replayVideo} disabled={helpUses === 0} {helpUses} />
							</div>
						{/if}
					{/if}
				</div>
			{/if}
			{#if !isMobile && videoEnded}
				<div class="mt-4 flex w-full max-w-6xl flex-col gap-4" in:fly={{ y: 300, duration: 400 }}>
					{#each shuffledOptions as option (option.id)}
						<GameButton
							size="small"
							onclick={() => handleAnswerClick(option.id)}
							variant={showColorFeedback(option.id)}
						>
							{option.text}
						</GameButton>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
	{#if isMobile && !isPortrait}
		<div class="fixed right-8 bottom-9 flex flex-col items-center gap-3">
			<div class="flex flex-col gap-2">
				{#each Array(4) as _, i}
					<HeartHandshake
						size={35}
						class="transition-all duration-500 {i < lives ? ' text-red-600' : 'text-gray-300'}"
					/>
				{/each}
			</div>
		</div>
	{/if}
	<!-- Answer tab -->
	<AnswerTab
		bind:showAnswerTab
		bind:answerTabCollapsed
		text="ODPOVĚDI"
		onCollapsedChange={(collapsed) => (answerTabCollapsed = collapsed)}
		{shuffledOptions}
		onAnswerClick={handleAnswerClick}
		{showColorFeedback}
		{isPortrait}
		{isMobile}
	/>
</Layout2>
