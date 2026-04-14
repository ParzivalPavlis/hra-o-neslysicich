<script lang="ts">
	import VideoPlayer from '$components/VideoPlayer.svelte';
	import AnswerTab from '$components/AnswerTab.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import PortraitOrientationWarning from '$components/PortraitOrientationWarning.svelte';
	import { shuffleArray, getOrientationInfo } from '$lib/client/shared/utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { answers } from '$lib/levels/5/answers';
	import type { AnswerOptionType } from '$types/answer';
	import {
		level5GameState,
		initializeLevel5Game,
		updateCurrentAnswer,
		decreaseLives,
		addAnswer
	} from '$lib/stores/level5';
	import LivesIndicator from '$components/LivesIndicator.svelte';
	import AlertButton from '$components/AlertButton.svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 5;
	const MAX_VARIABLE_VIDEOS = 5;
	const MIN_VARIABLE_VIDEOS = 3;
	const BUTTON_SHOW_DURATION = 3000;

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
	let currentVideoSrc = $state<string>('');
	let answersWithRandomVideo = $state<Set<number>>(new Set());
	let showInteractiveButton = $state(false);
	let buttonTimeoutId: NodeJS.Timeout | null = null;
	let buttonHideTimeoutId: NodeJS.Timeout | null = null;
	let videoDuration = $state(0);
	let buttonPosition = $state({ x: 0, y: 0 });

	// Derived state from store
	let gameState = $derived($level5GameState);
	let currentAnswerIndex = $derived(gameState.currentAnswerIndex);
	let lives = $derived(gameState.lives);

	function initializeRandomAnswers() {
		answersWithRandomVideo.clear();
		const randomCount = Math.floor(
			Math.random() * (MAX_VARIABLE_VIDEOS - MIN_VARIABLE_VIDEOS + 1) + MIN_VARIABLE_VIDEOS
		);
		const answerIndices = Array.from({ length: answers.length }, (_, i) => i);
		for (let i = 0; i < randomCount; i++) {
			const randomIdx = Math.floor(Math.random() * answerIndices.length);
			answersWithRandomVideo.add(answerIndices[randomIdx]);
			answerIndices.splice(randomIdx, 1);
		}
	}

	function initializeVideoForAnswer() {
		const currentAnswer = answers[currentAnswerIndex];
		if (currentAnswer && currentAnswer.videoSrc.length > 0) {
			if (answersWithRandomVideo.has(currentAnswerIndex) && currentAnswer.videoSrc.length > 1) {
				currentVideoSrc = currentAnswer.videoSrc[1];
			} else {
				currentVideoSrc = currentAnswer.videoSrc[0];
			}
		}
	}

	function scheduleInteractiveButton() {
		// Clear any existing timeouts
		if (buttonTimeoutId) clearTimeout(buttonTimeoutId);
		if (buttonHideTimeoutId) clearTimeout(buttonHideTimeoutId);

		// Only show button if this answer has a random video
		if (!answersWithRandomVideo.has(currentAnswerIndex)) {
			return;
		}

		// Show button at 60% of video duration
		const delay = videoDuration * 0.6;

		buttonTimeoutId = setTimeout(() => {
			// Generate random position within ±128px from center (256x256 square)
			buttonPosition = {
				x: Math.random() * 256 - 128,
				y: Math.random() * 256 - 128
			};
			showInteractiveButton = true;
			// Hide button after 1.5 seconds
			buttonHideTimeoutId = setTimeout(() => {
				showInteractiveButton = false;
			}, BUTTON_SHOW_DURATION);
		}, delay);
	}

	function handleVideoLoadedMetadata(duration: number) {
		videoDuration = duration;
	}

	function updateOrientation() {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
		isPortrait = orientation.isPortrait;
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
			scheduleInteractiveButton();
		}
	}

	function handleAlertButtonClick() {
		// Change to the first video and start playing
		const currentAnswer = answers[currentAnswerIndex];
		if (currentAnswer && currentAnswer.videoSrc.length > 0) {
			// Remove from random video set so it doesn't revert
			answersWithRandomVideo.delete(currentAnswerIndex);
			currentVideoSrc = currentAnswer.videoSrc[0];
			videoEnded = false;
			// Reset video to beginning and play
			if (videoPlayerRef) {
				setTimeout(() => {
					if (videoPlayerRef && videoPlayerRef.currentTime !== undefined) {
						videoPlayerRef.currentTime = 0;
					}
					if (videoPlayerRef && videoPlayerRef.play) {
						videoPlayerRef.play();
					}
				}, 0);
			}
		}
	}

	function handleVideoEnd() {
		if (buttonTimeoutId) clearTimeout(buttonTimeoutId);
		if (buttonHideTimeoutId) clearTimeout(buttonHideTimeoutId);
		showInteractiveButton = false;
		videoEnded = true;
		showAnswerTab = true;
	}

	$effect(() => {
		videoEnded = false;
		autoplayPrevented = false;
		disabledButtons = {};
		showInteractiveButton = false;
		buttonPosition = { x: 0, y: 0 };
		if (buttonTimeoutId) clearTimeout(buttonTimeoutId);
		if (buttonHideTimeoutId) clearTimeout(buttonHideTimeoutId);
		initializeVideoForAnswer();
		scheduleInteractiveButton();
		if (answers[currentAnswerIndex]) {
			shuffledOptions = shuffleArray(answers[currentAnswerIndex].options);
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
		initializeLevel5Game();
		initializeRandomAnswers();
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
							videoSrc={currentVideoSrc}
							bind:videoEnded
							bind:autoplayPrevented
							{helpUses}
							showSkipButton={true}
							onReplay={replayVideo}
							onVideoEnd={handleVideoEnd}
							onDurationChange={handleVideoLoadedMetadata}
						/>
						{#if showInteractiveButton}
							<div
								class="absolute flex items-center justify-center"
								style="left: calc(50% + {buttonPosition.x}px); top: calc(50% + {buttonPosition.y}px); transform: translate(-50%, -50%);"
							>
								<AlertButton onclick={handleAlertButtonClick} />
							</div>
						{/if}
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
						videoSrc={currentVideoSrc}
						bind:videoEnded
						bind:autoplayPrevented
						{helpUses}
						showSkipButton={true}
						onReplay={replayVideo}
						onVideoEnd={handleVideoEnd}
						onDurationChange={handleVideoLoadedMetadata}
					/>
					{#if showInteractiveButton}
						<div
							class="absolute flex items-center justify-center"
							style="left: calc(50% + {buttonPosition.x}px); top: calc(50% + {buttonPosition.y}px); transform: translate(-50%, -50%);"
						>
							<AlertButton onclick={handleAlertButtonClick} />
						</div>
					{/if}
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
