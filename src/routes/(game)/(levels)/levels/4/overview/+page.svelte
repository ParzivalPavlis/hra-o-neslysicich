<script lang="ts">
	import LevelCompletionCard from '$components/LevelCompletionCard.svelte';
	import { level4GameState } from '$lib/stores/level4';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { setFirstThreeStars } from '$lib/stores/lastPlayed';

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
			const data = JSON.parse(result.data);
			const actionResult = data[0];

			// Update store if first time getting 3 stars
			if (actionResult?.firstTimeThreeStars) {
				setFirstThreeStars(4);
				console.log('First time 3 stars on level 4! Store updated.');
			}

			// Force reload the game:progress cache
			if (actionResult?.success) {
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
