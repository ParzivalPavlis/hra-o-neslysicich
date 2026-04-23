<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import type { AnswersState } from '$types/store';

	type Props = {
		totalQuestions: number;
		currentAnswerIndex: number;
		answers: AnswersState[];
		onSelectQuestion?: (index: number) => void;
		isLastQuestionAnswered: boolean;
		compleationLink?: string;
		onContinue?: () => void;
	};

	let {
		totalQuestions,
		currentAnswerIndex,
		answers,
		onSelectQuestion,
		isLastQuestionAnswered,
		compleationLink,
		onContinue
	}: Props = $props();

	function getStatus(questionIndex: number) {
		const answer = answers.find((a) => a.questionId === questionIndex);
		if (!answer) return 'unanswered';
		return answer.isCorrect ? 'correct' : 'incorrect';
	}
</script>

<div class="flex w-full flex-col">
	<div class="grid w-full grid-cols-6 gap-2">
		{#each Array.from({ length: totalQuestions }, (_, i) => i) as questionIndex (questionIndex)}
			<button
				type="button"
				onclick={() => onSelectQuestion?.(questionIndex)}
				class={`flex min-w-15 cursor-pointer flex-col items-center gap-1 rounded-lg p-2 transition-all ${
					currentAnswerIndex === questionIndex
						? 'border-2 border-secondary bg-secondary/5'
						: 'border-2 border-gray-300 bg-gray-200 text-foreground hover:bg-gray-300'
				}`}
			>
				<span class="text-1xl font-bold">{questionIndex + 1}</span>
				<div
					class={`h-2 w-2 rounded-full ${
						getStatus(questionIndex) === 'correct'
							? 'bg-green-500'
							: getStatus(questionIndex) === 'incorrect'
								? 'bg-red-500'
								: 'bg-gray-400'
					}`}
				></div>
			</button>
		{/each}
	</div>
	{#if isLastQuestionAnswered && compleationLink && onContinue}
		<GameButton class="mt-4" onclick={onContinue}>Pokračovat na test</GameButton>
	{/if}
</div>
