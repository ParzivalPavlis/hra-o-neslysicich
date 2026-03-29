<script lang="ts">
	import type { LevelAnswersState } from '$types/store';

	type Props = {
		answers: LevelAnswersState[];
		currentAnswerIndex: number;
		totalQuestions: number;
		onSelectQuestion: (index: number) => void;
		isMobile?: boolean;
	};

	let {
		answers,
		currentAnswerIndex,
		totalQuestions,
		onSelectQuestion,
		isMobile = false
	}: Props = $props();

	function getStatus(questionIndex: number) {
		const answer = answers.find((a) => a.questionId === questionIndex);
		if (!answer) return 'unanswered';
		return answer.isCorrect ? 'correct' : 'incorrect';
	}
</script>

<!-- Desktop: regular layout -->
{#if !isMobile}
	<div class="flex w-full flex-col items-center gap-6 px-6 py-6">
		<div class="grid w-full max-w-2xl grid-cols-6 gap-4 sm:grid-cols-9 lg:grid-cols-9">
			{#each Array.from({ length: totalQuestions }, (_, i) => i) as questionIndex (questionIndex)}
				<button
					type="button"
					onclick={() => onSelectQuestion(questionIndex)}
					class={`flex cursor-pointer flex-col items-center gap-2 rounded-lg p-4 transition-all ${
						currentAnswerIndex === questionIndex
							? 'border-2 border-secondary bg-secondary/5'
							: 'border-2 border-gray-300 bg-gray-200 text-foreground hover:bg-gray-300'
					}`}
				>
					<span class="text-sm font-bold">{questionIndex + 1}</span>
					<div
						class={`h-3 w-3 rounded-full ${
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
	</div>
{/if}
