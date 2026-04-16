<script lang="ts">
	import LevelCompletionCard from '$components/LevelCompletionCard.svelte';
	import { level1 } from '$lib/stores/gameState';
	import { checkIsPlaying, setFirstThreeStars, setJustUnlockedLevel } from '$lib/stores/lastPlayed';
	import { goto, invalidate } from '$app/navigation';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { FormSaveLevelProgressResponseType } from '$lib/types/form';

	const CURRENT_LEVEL_NUMBER = 1;
	const NUMBER_OF_QUESTIONS = 8;
	const level1State = level1.store;

	let questionsState = $derived($level1State);
	let answers = $derived(questionsState.answers);
	let correctAnswers = $derived(answers.filter((answer) => answer.isCorrect).length);
	let totalQuestions = $derived(Math.max(answers.length, NUMBER_OF_QUESTIONS));

	let stars = $derived(() => {
		const percentage = (correctAnswers / totalQuestions) * 100;
		if (percentage >= 80) return 3;
		if (percentage >= 50) return 2;
		return 1;
	});

	const messages = {
		excellent: 'Výborně! Máte skvělé porozumění konverzaci.',
		good: 'Dobře! S trochou pozornosti to bude ještě lepší.',
		tryAgain: 'Zkuste to znovu a věnujte více pozornosti detailům.'
	};

	function handleRetry() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}

	function handleBackToLevels() {
		goto('/levels');
	}

	onMount(() => {
		if (!questionsState.completed) {
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
		} else {
			checkIsPlaying(CURRENT_LEVEL_NUMBER);
			// Auto-submit the form on mount
			const form = document.querySelector('form');
			if (form) form.requestSubmit();
		}
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<form
	method="POST"
	action="?/saveLevelProgress"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const actionResult = result.data as FormSaveLevelProgressResponseType;

				if (actionResult.firstTimeThreeStars === true) {
					setFirstThreeStars(CURRENT_LEVEL_NUMBER);
				}
				if (actionResult.unlockedLevel) {
					setJustUnlockedLevel(actionResult.unlockedLevel);
				}
				if (actionResult.success) {
					await invalidate('game:progress');
				}
			}
		};
	}}
>
	<input type="hidden" name="stars" value={stars()} />
	<input type="hidden" name="completed" value="true" />
</form>

<Layout1 centered={false}>
	<LevelCompletionCard
		{correctAnswers}
		{totalQuestions}
		onRetry={handleRetry}
		onBackToLevels={handleBackToLevels}
		title={`Úroveň ${CURRENT_LEVEL_NUMBER} dokončena!`}
		stars={stars()}
		{messages}
	/>
</Layout1>
