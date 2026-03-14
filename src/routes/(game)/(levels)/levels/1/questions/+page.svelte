<script lang="ts">
	import { goto } from '$app/navigation';
	import QuestionCard from '$components/QuestionCard.svelte';
	import questions from '$lib/levels/1/questions';
	import { selectRandomOptions } from '$lib/shared/utils';
	import {
		level1QuestionsState,
		initializeLevel1Questions,
		updateCurrentQuestion,
		addQuestionAnswer
	} from '$lib/stores/level1';
	import type { QuestionOptionType } from '$types/question';

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

		// Combine both groups for searching
		const allQuestions = [...questions.group1, ...questions.group2];

		// Get the original questions by ID and regenerate with randomized options
		const originalQuestions = questionIds
			.map((id) => allQuestions.find((q) => q.id === id))
			.filter((q) => q !== undefined);

		// Apply the same transformation as selectRandomQuestions (reassign IDs and randomize options)
		return originalQuestions.map((q, index) => ({
			...q,
			id: index + 1, // Reassign IDs to be sequential 1-8
			options: selectRandomOptions(q.options)
		}));
	});

	let currentQuestion = $derived(
		selectedQuestions().find((q) => q && q.id === currentQuestionIndex) || null
	);

	let personImagePath = $derived(`/assets/level1/${personImage}.png`);

	let answersMap = $derived.by(() => {
		const map: Record<number, boolean> = {};
		questionsState.answers.forEach((answer) => {
			map[answer.questionId] = answer.isCorrect;
		});
		return map;
	});

	let totalQuestions = $derived(selectedQuestions().length);

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
		} else {
			goto('/levels/1/overview');
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
			// Select 4 random from group1
			const shuffledGroup1 = [...questions.group1].sort(() => 0.5 - Math.random());
			const selectedFromGroup1 = shuffledGroup1.slice(0, 4);

			// Select 4 random from group2
			const shuffledGroup2 = [...questions.group2].sort(() => 0.5 - Math.random());
			const selectedFromGroup2 = shuffledGroup2.slice(0, 4);

			// Combine and shuffle all selected questions
			const combinedQuestions = [...selectedFromGroup1, ...selectedFromGroup2].sort(
				() => 0.5 - Math.random()
			);
			const originalIds = combinedQuestions.map((q) => q.id);
			initializeLevel1Questions(originalIds);
		}
	});
</script>

<div class="relative flex min-h-screen flex-col items-center px-5 py-5 md:p-10">
	<QuestionCard
		{currentQuestion}
		{currentQuestionIndex}
		{personImagePath}
		onAnswerSelect={handleAnswerSelect}
		{showColorFeedback}
		{totalQuestions}
		answers={answersMap}
	/>
</div>
