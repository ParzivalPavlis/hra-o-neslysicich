<script lang="ts">
	import LevelCompletionCard from '$components/LevelCompletionCard.svelte';
	import { level4GameState } from '$lib/stores/level4';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { setFirstThreeStars } from '$lib/stores/lastPlayed';
	import { enhance } from '$app/forms';
	import type { FormSaveLevelProgressResponseType } from '$lib/types/form';

	let gameState = $derived($level4GameState);
	let answers = $derived(gameState.answers);
	let lives = $derived(gameState.lives);
	let totalQuestions = $derived(answers.length);
	let maxLives = 4;

	let stars = $derived(() => {
		// Stars based on remaining lives (out of 4)
		if (lives === maxLives) return 3;
		if (lives >= 2) return 2;
		if (lives === 1) return 1;
		return 0;
	});

	let progressSaved = $state(false);

	const messages = {
		excellent: 'Výborně! Předvedli jste skvělé porozumění videa.',
		good: 'Dobře! S větší pozorností to bude ještě lepší.',
		tryAgain: 'Zkuste to znovu a věnujte více pozornosti detailům.'
	};

	function handleRetry() {
		goto('/levels/4/game');
	}

	function handleBackToLevels() {
		goto('/levels');
	}

	onMount(() => {
		// Auto-submit the form on mount
		const form = document.querySelector('form');
		if (form) form.requestSubmit();
	});
</script>

<svelte:head>
	<title>Úroveň 4 | Deafio</title>
</svelte:head>

<form
	method="POST"
	action="?/saveLevelProgress"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const actionResult = result.data as FormSaveLevelProgressResponseType;

				if (actionResult.firstTimeThreeStars === true) {
					setFirstThreeStars(4);
				}
				if (actionResult.success) {
					progressSaved = true;
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
		title="Úroveň 4 dokončena!"
		{messages}
		stars={stars()}
		variant="lives"
		{maxLives}
		{lives}
	/>
</Layout1>
