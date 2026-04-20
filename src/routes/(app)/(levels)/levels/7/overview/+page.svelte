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
	const level7State = level7.store;

	const messages = {
		excellent: 'Výborně! Úspěšně jste prozkoumali kavárnu a pomohli Tomášovi.',
		good: 'Skvělá práce! Tomáš se cítil v kavárně jako doma.',
		tryAgain: 'Zkuste to znovu a prozkoumejte všechny možnosti.'
	};

	function handleRetry() {
		level7.initialize();
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
	<input type="hidden" name="stars" value={3} />
	<input type="hidden" name="completed" value="true" />
</form>

<Layout1 centered={false}>
	<LevelCompletionCard
		totalQuestions={4}
		correctAnswers={4}
		onRetry={handleRetry}
		onBackToLevels={handleBackToLevels}
		title={`Úroveň ${CURRENT_LEVEL_NUMBER} dokončena!`}
		{messages}
		stars={3}
	/>
</Layout1>
