<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import questions from '$lib/levels/1/questions';
	import { cn } from '$lib/utils';
	import type { QuestionOptionType } from '$types/question';
	import { fade } from 'svelte/transition';

	let currentQuestionIndex = $state(1);
	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);
	let personImage = $state<'man_thinking' | 'man_correct' | 'man_wrong'>('man_thinking');

	// Function to randomly select 3 options with 1 correct answer always included
	function selectRandomOptions(options: QuestionOptionType[]) {
		const correctOption = options.find((opt) => opt.correct);
		const incorrectOptions = options.filter((opt) => !opt.correct);

		// If we have exactly 3 options already, just shuffle and return
		if (options.length === 3) {
			return [...options].sort(() => 0.5 - Math.random());
		}

		// Otherwise, select 2 random incorrect options + the correct one
		const shuffledIncorrect = [...incorrectOptions].sort(() => 0.5 - Math.random());
		const selectedIncorrect = shuffledIncorrect.slice(0, 2);

		// Combine correct + 2 incorrect, then shuffle
		const finalOptions = correctOption ? [correctOption, ...selectedIncorrect] : selectedIncorrect;
		return finalOptions.sort(() => 0.5 - Math.random());
	}

	// Function to randomly select 6 questions
	function selectRandomQuestions(allQuestions: typeof questions, count: number) {
		const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count).map((q, index) => ({
			...q,
			id: index + 1, // Reassign IDs to be sequential 1-6
			options: selectRandomOptions(q.options)
		}));
	}

	// Get 6 random questions
	let selectedQuestions = $state(selectRandomQuestions(questions, 6));
	let currentQuestion = $derived(selectedQuestions.find((q) => q.id === currentQuestionIndex));

	function handleAnswerSelect(option: QuestionOptionType) {
		if (showingFeedback) return;

		selectedAnswer = option.id;
		isCorrect = option.correct;
		showingFeedback = true;
		personImage = isCorrect ? 'man_correct' : 'man_wrong';

		// Show feedback for 1.5 seconds, then move to next question
		setTimeout(() => {
			showingFeedback = false;
			selectedAnswer = null;
			personImage = 'man_thinking';
			goToNext();
		}, 1500);
	}

	function goToNext() {
		if (currentQuestionIndex < selectedQuestions.length) {
			currentQuestionIndex++;
		}
	}

	function showColorFeedback(optionId: string) {
		if (!showingFeedback || selectedAnswer !== optionId) return '';
		return isCorrect
			? '!bg-green-500 !text-white !shadow-[0_6px_0_rgb(21,128,61)] hover:!shadow-[0_8px_0_rgb(21,128,61)] active:!shadow-[0_4px_0_rgb(21,128,61)]'
			: '!bg-red-500 !text-white !shadow-[0_6px_0_rgb(185,28,28)] hover:!shadow-[0_8px_0_rgb(185,28,28)] active:!shadow-[0_4px_0_rgb(185,28,28)]';
	}
</script>

<div class="relative flex min-h-screen flex-col items-center px-5 py-5 md:p-10">
	<div class="relative flex w-full max-w-180 flex-col">
		<div
			class="flex h-40 w-full items-center justify-center rounded-2xl border-2 border-foreground bg-white p-3"
		>
			{#if currentQuestion}
				{#key currentQuestionIndex}
					<span class="text-center" in:fade>{currentQuestion.question}</span>
				{/key}
			{/if}
		</div>

		<div class="mt-4 flex flex-col gap-3">
			{#if currentQuestion}
				{#each currentQuestion.options as option}
					<GameButton
						variant={2}
						class={cn('w-full', showColorFeedback(option.id))}
						onclick={() => handleAnswerSelect(option)}
					>
						{option.text}
					</GameButton>
				{/each}
			{/if}
		</div>
		<img
			src="/assets/level1/{personImage}.png"
			style="transform: scaleX(-1)"
			class="z-[-1] max-h-100 w-full object-contain md:max-h-180"
			alt="Question Character"
		/>
	</div>
</div>
