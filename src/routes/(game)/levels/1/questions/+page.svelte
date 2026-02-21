<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import questionsData from '$lib/levels/1/questions';
	import { selectRandomQuestions, selectRandomOptions } from '$lib/shared/utils';
	import {
		level1QuestionsState,
		initializeLevel1Questions,
		updateCurrentQuestion,
		addQuestionAnswer
	} from '$lib/stores/level1';
	import type { QuestionOptionType } from '$types/question';
	import { fade } from 'svelte/transition';

	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);
	let personImage = $state<'man_thinking' | 'man_correct' | 'man_wrong'>('man_thinking');

	// Get questions state from store
	let questionsState = $derived($level1QuestionsState);
	let questionIds = $derived(questionsState.questionIds);
	let currentQuestionIndex = $derived(questionsState.currentQuestionIndex);

	// Regenerate selected questions based on stored original IDs
	let selectedQuestions = $derived(() => {
		if (!questionIds || questionIds.length === 0) return [];

		// Get the original questions by ID and regenerate with randomized options
		const originalQuestions = questionIds
			.map((id) => questionsData.find((q) => q.id === id))
			.filter((q) => q !== undefined);

		// Apply the same transformation as selectRandomQuestions (reassign IDs and randomize options)
		return originalQuestions.map((q, index) => ({
			...q,
			id: index + 1, // Reassign IDs to be sequential 1-6
			options: selectRandomOptions(q.options)
		}));
	});

	let currentQuestion = $derived(
		selectedQuestions().find((q) => q && q.id === currentQuestionIndex) || null
	);

	function handleAnswerSelect(option: QuestionOptionType) {
		if (showingFeedback) return;

		selectedAnswer = option.id;
		isCorrect = option.correct;
		showingFeedback = true;
		personImage = isCorrect ? 'man_correct' : 'man_wrong';

		// Record the answer in the quiz state
		addQuestionAnswer(currentQuestionIndex, option.id, option.correct);

		// Show feedback for 1.5 seconds, then move to next question
		setTimeout(() => {
			showingFeedback = false;
			selectedAnswer = null;
			personImage = 'man_thinking';
			goToNext();
		}, 1500);
	}

	function goToNext() {
		const questions = selectedQuestions();
		if (questions && currentQuestionIndex < questions.length) {
			const nextIndex = currentQuestionIndex + 1;
			updateCurrentQuestion(nextIndex);
		}
	}

	function showColorFeedback(optionId: string) {
		if (!showingFeedback || selectedAnswer !== optionId) return 1;
		return isCorrect ? 2 : 3;
	}

	// Initialize questions from store or generate new ones
	$effect(() => {
		const storedState = $level1QuestionsState;
		if (!storedState.questionIds || storedState.questionIds.length === 0) {
			// Generate new questions and store their original IDs
			const newQuestions = selectRandomQuestions(questionsData, 6);
			// Extract the original question IDs (from before selectRandomQuestions reassignment)
			const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
			const originalIds = shuffled.slice(0, 6).map((q) => q.id);
			initializeLevel1Questions(originalIds);
		}
	});
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
						class="w-full"
						onclick={() => handleAnswerSelect(option)}
						size="small"
						variant={showColorFeedback(option.id)}
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
