<script lang="ts">
	import LevelCompletionCard from '$components/LevelCompletionCard.svelte';
	import { level1QuestionsState } from '$lib/stores/level1';
	import { setFirstThreeStars } from '$lib/stores/levelFirstThreeStars';
	import { goto, invalidate } from '$app/navigation';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { onMount } from 'svelte';

	let questionsState = $derived($level1QuestionsState);
	let answers = $derived(questionsState.answers);
	let correctAnswers = $derived(answers.filter((answer) => answer.isCorrect).length);
	let totalQuestions = $derived(Math.max(answers.length, 6));

	let stars = $derived(() => {
		const percentage = (correctAnswers / totalQuestions) * 100;
		if (percentage >= 80) return 3;
		if (percentage >= 50) return 2;
		return 1;
	});

	let progressSaved = $state(false);

	const messages = {
		excellent: 'Výborně! Máte skvělé porozumění konverzaci.',
		good: 'Dobře! S trochou pozornosti to bude ještě lepší.',
		tryAgain: 'Zkuste to znovu a věnujte více pozornosti detailům.'
	};

	function handleRetry() {
		goto('/levels/1');
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
				setFirstThreeStars(1);
				console.log('First time 3 stars on level 1! Store updated.');
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
		{correctAnswers}
		{totalQuestions}
		onRetry={handleRetry}
		onBackToLevels={handleBackToLevels}
		title="Úroveň 1 dokončena!"
		stars={stars()}
		{messages}
	/>
</Layout1>
