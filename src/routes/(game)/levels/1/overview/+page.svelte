<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import { level1QuestionsState } from '$lib/stores/level1';
	import { goto } from '$app/navigation';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Heading from '$components/typography/Heading.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { Star } from '@lucide/svelte';

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

	function handleRetry() {
		goto('/levels/1');
	}

	function handleBackToLevels() {
		goto('/levels');
	}
</script>

<Layout1>
	<div class="relative flex w-full max-w-180 flex-col items-center gap-8">
		<div class="flex flex-col text-center">
			<Heading variant={2}>Úroveň 1 dokončena!</Heading>
		</div>
		<div class="rounded-2xl border-2 border-foreground bg-white p-8 text-center">
			<div class="mb-4 text-6xl font-bold text-foreground">
				{correctAnswers}/{totalQuestions}
			</div>
			<Paragraph>Správných odpovědí</Paragraph>
		</div>
		<div class="flex gap-2">
			{#each Array(3) as _, i}
				<div class="flex">
					{#if i < stars()}
						<Star size={55} color="gold" fill="gold" />
					{:else}
						<Star size={55} />
					{/if}
				</div>
			{/each}
		</div>
		<div class="text-center">
			<Paragraph variant={3}>
				{#if stars() === 3}
					Výborně! Máte skvělé porozumění konverzaci.
				{:else if stars() === 2}
					Dobře! S trochou pozornosti to bude ještě lepší.
				{:else}
					Zkuste to znovu a věnujte více pozornosti detailům.
				{/if}
			</Paragraph>
		</div>
		<div class="flex w-full max-w-150 flex-col gap-4">
			<GameButton class="w-full" onclick={handleRetry} size="medium" variant={1}>
				Zkusit znovu
			</GameButton>
			<GameButton class="w-full" onclick={handleBackToLevels} size="medium" variant={1}>
				Zpět na úrovně
			</GameButton>
		</div>
	</div>
</Layout1>
