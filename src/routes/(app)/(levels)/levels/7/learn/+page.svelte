<script lang="ts">
	import AnswerTab from '$components/AnswerTab.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import LearningMenu from '$components/LearningMenu.svelte';
	import PortraitOrientationWarning from '$components/PortraitOrientationWarning.svelte';
	import VideoPlayer from '$components/VideoPlayer.svelte';
	import { getOrientationInfo, shuffleArray } from '$lib/client/shared/gameUtils';
	import { answers } from '$lib/levels/7/answers';
	import type { AnswerOptionType } from '$types/answer';
	import { level7 } from '$lib/stores/gameState';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 7;
	const level7State = level7.store;

	let isPortrait = $state(true);
	let isMobile = $state(false);
	let showAnswerTab = $state(false);
	let answerTabCollapsed = $state(false);
	let videoEnded = $state(false);
	let autoplayPrevented = $state(false);
	let shuffledOptions = $state<AnswerOptionType[]>([]);
	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);
	let correctAnswerId = $state<string | null>(null);
	let videoPlayerRef: VideoPlayer | null = $state(null);
	let shuffledVideos = $state<number[]>([]);

	let gameState = $derived($level7State);
	let currentAnswerIndex = $derived(gameState.currentAnswerIndex);
	let actualAnswerIndex = $derived(shuffledVideos[currentAnswerIndex] ?? currentAnswerIndex);

	function updateOrientation() {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
		isPortrait = orientation.isPortrait;
	}

	function handleAnswerClick(optionId: string) {
		if (showingFeedback) return;

		const currentAnswer = answers[actualAnswerIndex];
		const selectedOption = currentAnswer.options.find((opt) => opt.id === optionId);

		if (selectedOption) {
			selectedAnswer = optionId;
			isCorrect = selectedOption.correct;
			showingFeedback = true;

			// Record the answer in the store
			level7.modifyAnswer(currentAnswerIndex, optionId, isCorrect);

			setTimeout(() => {
				showAnswerTab = false;
				if (currentAnswerIndex < answers.length - 1) {
					level7.updateCurrentAnswer(currentAnswerIndex + 1);
				} else {
					showAnswerTab = true;
				}
				showingFeedback = false;
				selectedAnswer = null;
			}, 1500);
		}
	}

	function handleSelectQuestion(questionIndex: number) {
		if (questionIndex !== currentAnswerIndex) {
			level7.updateCurrentAnswer(questionIndex);
			videoEnded = false;
			showAnswerTab = false;
		}
	}

	function handleVideoEnd() {
		videoEnded = true;
		showAnswerTab = true;
	}

	$effect(() => {
		videoEnded = false;
		autoplayPrevented = false;
		if (answers[actualAnswerIndex]) {
			shuffledOptions = shuffleArray(answers[actualAnswerIndex].options);
			// Find the correct answer ID
			const correctOption = answers[actualAnswerIndex].options.find((opt) => opt.correct);
			correctAnswerId = correctOption?.id ?? null;
		}
	});

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
		updateOrientation();
		level7.initialize();
		// Create shuffled array of video indices [0, 1, 2, ..., 17]
		const indices = Array.from({ length: answers.length }, (_, i) => i);
		shuffledVideos = shuffleArray(indices);
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
		<LearningMenu
			answers={gameState.answers}
			{currentAnswerIndex}
			totalQuestions={answers.length}
			onSelectQuestion={handleSelectQuestion}
			compleationLink={`/levels/${CURRENT_LEVEL_NUMBER}/game`}
			{isMobile}
		/>
		<div class="flex w-full flex-col items-center justify-center landscape:gap-2">
			<!-- Desktop layout with video and help button side by side -->
			{#if !isMobile}
				<div class="relative w-full max-w-6xl">
					<div
						class="relative aspect-video overflow-hidden rounded-lg border-2 border-foreground bg-transparent landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
					>
						<VideoPlayer
							bind:this={videoPlayerRef}
							videoSrc={answers[actualAnswerIndex].videoSrc}
							bind:videoEnded
							bind:autoplayPrevented
							showSkipButton={true}
							onVideoEnd={handleVideoEnd}
						/>
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
						videoSrc={answers[actualAnswerIndex].videoSrc}
						bind:videoEnded
						bind:autoplayPrevented
						showSkipButton={true}
						onVideoEnd={handleVideoEnd}
					/>
				</div>
			{/if}
			<!-- Desktop answer tab -->
			{#if !isMobile && videoEnded}
				<AnswerTab
					bind:showAnswerTab
					bind:answerTabCollapsed
					text="MOŽNOSTI"
					onCollapsedChange={(collapsed) => (answerTabCollapsed = collapsed)}
					{shuffledOptions}
					onAnswerClick={handleAnswerClick}
					{showingFeedback}
					{selectedAnswer}
					{isCorrect}
					{correctAnswerId}
					{isPortrait}
					{isMobile}
				/>
			{/if}
		</div>
	{/if}
	<!-- Answer tab for mobile -->
	{#if isMobile && !isPortrait}
		<AnswerTab
			bind:showAnswerTab
			bind:answerTabCollapsed
			text="MOŽNOSTI"
			onCollapsedChange={(collapsed) => (answerTabCollapsed = collapsed)}
			{shuffledOptions}
			onAnswerClick={handleAnswerClick}
			{showingFeedback}
			{selectedAnswer}
			{isCorrect}
			{correctAnswerId}
			{isPortrait}
			{isMobile}
			answers={gameState.answers}
			{currentAnswerIndex}
			totalQuestions={answers.length}
			onSelectQuestion={handleSelectQuestion}
			compleationLink={`/levels/${CURRENT_LEVEL_NUMBER}/game`}
		/>
	{/if}
</Layout2>
