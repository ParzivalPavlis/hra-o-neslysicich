<script lang="ts">
	import VideoPlayer from '$components/VideoPlayer.svelte';
	import AnswerTab from '$components/AnswerTab.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import PortraitOrientationWarning from '$components/PortraitOrientationWarning.svelte';
	import { shuffleArray, getOrientationInfo } from '$lib/client/shared/utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { answers } from '$lib/levels/7/answers';
	import type { AnswerOptionType, AnswerType } from '$types/answer';
	import {
		level7GameState,
		initializeLevel7Game,
		updateCurrentAnswer,
		decreaseLives,
		addAnswer
	} from '$lib/stores/level7';
	import LivesIndicator from '$components/LivesIndicator.svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 7;

	let isPortrait = $state(true);
	let isMobile = $state(false);
	let showAnswerTab = $state(false);
	let answerTabCollapsed = $state(false);
	let helpUses = $state(3);
	let videoEnded = $state(false);
	let autoplayPrevented = $state(false);
	let shuffledOptions = $state<AnswerOptionType[]>([]);
	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);
	let disabledButtons = $state<Record<string, boolean>>({});
	let videoPlayerRef: any = $state(null);
	let shuffledVideos = $state<AnswerType[]>([]);

	// Derived state from store
	let gameState = $derived($level7GameState);
	let currentAnswerIndex = $derived(gameState.currentAnswerIndex);
	let lives = $derived(gameState.lives);

	function updateOrientation() {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
		isPortrait = orientation.isPortrait;
	}

	function handleAnswerClick(optionId: string) {
		if (showingFeedback) return;

		const currentAnswer = shuffledVideos[currentAnswerIndex];
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
					if (currentAnswerIndex < shuffledVideos.length - 1) {
						updateCurrentAnswer(currentAnswerIndex + 1);
					} else {
						// Last question answered correctly - navigate to overview
						goto(`/levels/${CURRENT_LEVEL_NUMBER}/overview`);
					}
				} else {
					decreaseLives();
					// Disable incorrect answer button after feedback is shown
					disabledButtons[optionId] = true;
				}
				showingFeedback = false;
				selectedAnswer = null;
			}, 1500);
		}
	}

	function replayVideo() {
		if (helpUses > 0) {
			helpUses--;
			videoEnded = false;
		}
	}

	function handleVideoEnd() {
		videoEnded = true;
		showAnswerTab = true;
	}

	$effect(() => {
		videoEnded = false;
		autoplayPrevented = false;
		disabledButtons = {};
		if (shuffledVideos[currentAnswerIndex]) {
			shuffledOptions = shuffleArray(shuffledVideos[currentAnswerIndex].options);
		}
	});

	$effect(() => {
		if (lives === 0) {
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/overview`);
		}
	});

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
		updateOrientation();
		initializeLevel7Game();
		// Shuffle answers and take first 10
		const allAnswersShuffled = shuffleArray([...answers]);
		shuffledVideos = allAnswersShuffled.slice(0, 10);
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<svelte:window on:orientationchange={updateOrientation} on:resize={updateOrientation} />
<Layout2>
	{#if isMobile && isPortrait}
		<PortraitOrientationWarning />
	{:else}
		<div class="flex w-full flex-col items-center justify-center landscape:gap-2">
			<!-- Desktop layout with video and help button side by side -->
			{#if !isMobile}
				<div class="relative w-full max-w-6xl">
					<div
						class="relative aspect-video overflow-hidden rounded-lg border-2 border-foreground bg-transparent landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
					>
						<VideoPlayer
							bind:this={videoPlayerRef}
							videoSrc={shuffledVideos[currentAnswerIndex]?.videoSrc}
							bind:videoEnded
							bind:autoplayPrevented
							{helpUses}
							showSkipButton={true}
							onReplay={replayVideo}
							onVideoEnd={handleVideoEnd}
						/>
					</div>
					<!-- Lives indicator for desktop - absolute positioned -->
					<div class="absolute top-4 right-4 flex flex-col gap-2">
						<LivesIndicator {lives} />
					</div>
				</div>
			{/if}

			<!-- Mobile layout with video only -->
			{#if isMobile}
				<div
					class="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg border-2 border-foreground bg-transparent landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
				>
					<VideoPlayer
						bind:this={videoPlayerRef}
						videoSrc={shuffledVideos[currentAnswerIndex]?.videoSrc}
						bind:videoEnded
						bind:autoplayPrevented
						{helpUses}
						showSkipButton={true}
						onReplay={replayVideo}
						onVideoEnd={handleVideoEnd}
					/>
				</div>
			{/if}
			<!-- Desktop answer tab -->
			{#if !isMobile && videoEnded}
				<AnswerTab
					bind:showAnswerTab
					bind:answerTabCollapsed
					text="ODPOVĚDI"
					onCollapsedChange={(collapsed) => (answerTabCollapsed = collapsed)}
					{shuffledOptions}
					onAnswerClick={handleAnswerClick}
					{showingFeedback}
					{selectedAnswer}
					{isCorrect}
					{isPortrait}
					{isMobile}
					{disabledButtons}
				/>
			{/if}
		</div>
	{/if}
	{#if isMobile && !isPortrait}
		<div class="fixed right-8 bottom-9 flex flex-col items-center gap-3">
			<div class="flex flex-col gap-2">
				<LivesIndicator {lives} />
			</div>
		</div>
	{/if}
	<!-- Answer tab for mobile -->
	{#if isMobile && !isPortrait}
		<AnswerTab
			bind:showAnswerTab
			bind:answerTabCollapsed
			text="ODPOVĚDI"
			onCollapsedChange={(collapsed) => (answerTabCollapsed = collapsed)}
			{shuffledOptions}
			onAnswerClick={handleAnswerClick}
			{showingFeedback}
			{selectedAnswer}
			{isCorrect}
			{isPortrait}
			{isMobile}
			{disabledButtons}
		/>
	{/if}
</Layout2>
