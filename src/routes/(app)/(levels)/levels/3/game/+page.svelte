<script lang="ts">
	import VideoPlayer from '$components/VideoPlayer.svelte';
	import AnswerTab from '$components/AnswerTab.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import PortraitOrientationWarning from '$components/PortraitOrientationWarning.svelte';
	import {
		shuffleArray,
		getOrientationInfo,
		createAnswerClickHandler
	} from '$lib/client/shared/gameUtils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { answers } from '$lib/levels/3/answers';
	import type { AnswerOptionType } from '$types/answer';
	import { level3 } from '$lib/stores/gameState';
	import LivesIndicator from '$components/LivesIndicator.svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 3;
	const level3State = level3.store;

	let isPortrait = $state(true);
	let isMobile = $state(false);
	let showAnswerTab = $state(false);
	let answerTabCollapsed = $state(false);
	let helpUses = $state(10);
	let videoEnded = $state(false);
	let autoplayPrevented = $state(false);
	let shuffledOptions = $state<AnswerOptionType[]>([]);
	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);
	let disabledButtons = $state<Record<string, boolean>>({});
	let currentVideoSrc = $state('');
	let levelCompleting = $state(false);

	// Derived state from store
	let gameState = $derived($level3State);
	let currentAnswerIndex = $derived(gameState.currentAnswerIndex);
	let lives = $derived(gameState.lives);

	function updateOrientation() {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
		isPortrait = orientation.isPortrait;
	}

	const handleAnswerClick = createAnswerClickHandler(
		level3,
		CURRENT_LEVEL_NUMBER,
		{
			isShowingFeedback: () => showingFeedback,
			getVideos: () => answers,
			getCurrentAnswerIndex: () => currentAnswerIndex
		},
		{
			setShowingFeedback: (v) => {
				showingFeedback = v;
			},
			setSelectedAnswer: (v) => {
				selectedAnswer = v;
			},
			setIsCorrect: (v) => {
				isCorrect = v;
			},
			setShowAnswerTab: (v) => {
				showAnswerTab = v;
			},
			disableButton: (id) => {
				disabledButtons[id] = true;
			}
		},
		{
			onComplete: () => {
				levelCompleting = true;
				currentVideoSrc = '/assets/level3/8.mp4';
				videoEnded = false;
			}
		}
	);

	function replayVideo() {
		if (levelCompleting) return;
		if (helpUses > 0) {
			helpUses--;
			videoEnded = false;
		}
	}

	function handleVideoEnd() {
		videoEnded = true;
		if (levelCompleting) {
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/overview`);
			return;
		}
		showAnswerTab = true;
	}

	$effect(() => {
		videoEnded = false;
		autoplayPrevented = false;
		disabledButtons = {};
		if (answers[currentAnswerIndex]) {
			currentVideoSrc = answers[currentAnswerIndex].videoSrc;
			shuffledOptions = shuffleArray(answers[currentAnswerIndex].options);
		}
	});

	$effect(() => {
		if (lives === 0) {
			level3.markCompleted();
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/overview`);
		}
	});

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
		updateOrientation();
		level3.initialize();
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
							videoSrc={currentVideoSrc}
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
						videoSrc={answers[currentAnswerIndex].videoSrc}
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
