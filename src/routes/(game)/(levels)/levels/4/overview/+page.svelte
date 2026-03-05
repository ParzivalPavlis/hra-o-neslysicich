<script lang="ts">
	import LevelCompletionScreen from '$components/LevelCompletionScreen.svelte';
	import { level4GameState } from '$lib/stores/level4';
	import { goto, invalidate } from '$app/navigation';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import { onMount } from 'svelte';

	let gameState = $derived($level4GameState);
	let answers = $derived(gameState.answers);
	let lives = $derived(gameState.lives);
	let correctAnswers = $derived(answers.filter((answer) => answer.isCorrect).length);
	let totalQuestions = $derived(answers.length);

	let stars = $derived(() => {
		// Stars based on remaining lives (out of 4)
		if (lives === 4) return 3;
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

	async function saveLevelProgress() {
		const formData = new FormData();
		formData.append('stars', stars().toString());
		formData.append('completed', 'true');

		try {
			const response = await fetch('?/saveLevelProgress', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			// Force reload the game:progress cache
			if (result.data?.success) {
				progressSaved = true;
				await invalidate('game:progress');
			}
		} catch (error) {
			console.error('Error saving level progress:', error);
		}
	}

	onMount(() => {
		saveLevelProgress();
	});
</script>

<Layout2>
	<LevelCompletionScreen
		{correctAnswers}
		{totalQuestions}
		onRetry={handleRetry}
		onBackToLevels={handleBackToLevels}
		title="Úroveň 4 dokončena!"
		{messages}
		stars={stars()}
	/>
</Layout2>
