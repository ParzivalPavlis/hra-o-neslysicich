<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import type { QuestionOptionType, QuestionType } from '$types/question';
	import { fade } from 'svelte/transition';

	let {
		currentQuestion,
		currentQuestionIndex,
		personImagePath,
		onAnswerSelect,
		showColorFeedback,
		totalQuestions = 8,
		answers = {}
	}: {
		currentQuestion: QuestionType | null;
		currentQuestionIndex: number;
		personImagePath: string;
		onAnswerSelect: (option: QuestionOptionType) => void;
		showColorFeedback: (optionId: string) => 1 | 2 | 3;
		totalQuestions?: number;
		answers?: Record<number, boolean>;
	} = $props();
</script>

<div class="relative flex w-full max-w-180 flex-col">
	<div
		class="relative flex h-40 w-full items-center justify-center rounded-2xl border-2 border-foreground bg-white p-3"
	>
		{#if currentQuestion}
			{#key currentQuestionIndex}
				<span class="text-center" in:fade>{currentQuestion.question}</span>
			{/key}
		{/if}
		<div class="absolute bottom-2 flex justify-center gap-2">
			{#each Array.from({ length: totalQuestions }, (_, i) => i + 1) as questionNum (questionNum)}
				{@const isAnswered = questionNum in answers}
				{@const isCorrect = answers[questionNum]}
				<div
					class="h-2.5 w-2.5 rounded-full transition-colors"
					class:bg-green-500={isAnswered && isCorrect}
					class:bg-red-500={isAnswered && !isCorrect}
					class:bg-gray-400={!isAnswered}
				></div>
			{/each}
		</div>
	</div>

	<div class="mt-4 flex flex-col gap-3">
		{#if currentQuestion}
			{#each currentQuestion.options as option (option.id)}
				<GameButton
					class="w-full"
					onclick={() => onAnswerSelect(option)}
					size="small"
					variant={showColorFeedback(option.id)}
				>
					{option.text}
				</GameButton>
			{/each}
		{/if}
	</div>
	<img
		src={personImagePath}
		style="transform: scaleX(-1); max-height: calc(100vh - 400px)"
		class="z-[-1] w-full object-contain"
		alt="Question Character"
	/>
</div>
