<script lang="ts">
	import LevelCompletionCard from '$components/LevelCompletionCard.svelte';
	import { level7 } from '$lib/stores/gameState';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { checkIsPlaying, setFirstThreeStars } from '$lib/stores/lastPlayed';
	import { enhance } from '$app/forms';
	import type { FormSaveLevelProgressResponseType } from '$lib/types/form';

	const CURRENT_LEVEL_NUMBER = 7;
	const MAX_LIVES = 4;
	const level7State = level7.store;

	let gameState = $derived($level7State);
	let answers = $derived(gameState.answers);
	let lives = $derived(gameState.lives);
	let totalQuestions = $derived(answers.length);

	let stars = $derived(() => {
		// Stars based on remaining lives (out of 4)
		if (lives === MAX_LIVES) return 3;
		if (lives >= 2) return 2;
		if (lives === 1) return 1;
		return 0;
	});

	const messages = {
		excellent: 'Výborně! Předvedli jste skvělé porozumění znakového jazyka.',
		good: 'Dobře! S větší pozorností to bude ještě lepší.',
		tryAgain: 'Projděte si znovu jednotlivé znaky.'
	};

	function handleRetry() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}

	function handleBackToLevels() {
		goto('/levels');
	}

	onMount(() => {
		if (!$level7State.completed) {
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
		{totalQuestions}
		onRetry={handleRetry}
		onBackToLevels={handleBackToLevels}
		title={`Úroveň ${CURRENT_LEVEL_NUMBER} dokončena!`}
		{messages}
		stars={stars()}
		variant="lives"
		maxLives={MAX_LIVES}
		{lives}
	/>
</Layout1>
