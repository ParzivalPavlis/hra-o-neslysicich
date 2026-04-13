<script lang="ts">
	import { goto } from '$app/navigation';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import QuestionCard from '$components/QuestionCard.svelte';
	import questions from '$lib/levels/2/questions';
	import { selectRandomOptions } from '$lib/client/shared/utils';
	import {
		level2QuestionsState,
		initializeLevel2Questions,
		updateCurrentQuestion,
		addQuestionAnswer
	} from '$lib/stores/level2';
	import type { QuestionOptionType } from '$types/question';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 2;
	const NUMBER_OF_QUESTIONS_GROUP1 = 4;
	const NUMBER_OF_QUESTIONS_GROUP2 = 4;

	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);
	let personImage = $state<'man_thinking' | 'man_correct' | 'man_wrong'>('man_thinking');
	let questionsState = $derived($level2QuestionsState);
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

	let personImagePath = $derived(`/assets/common/${personImage}.png`);

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
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/overview`);
		}
	}

	function showColorFeedback(optionId: string) {
		if (!showingFeedback || selectedAnswer !== optionId) return 1;
		return isCorrect ? 2 : 3;
	}

	// Initialize questions from store or generate new ones
	$effect(() => {
		const storedState = $level2QuestionsState;
		if (!storedState.questionIds || storedState.questionIds.length === 0) {
			// Select random from group1
			const shuffledGroup1 = [...questions.group1].sort(() => 0.5 - Math.random());
			const selectedFromGroup1 = shuffledGroup1.slice(0, NUMBER_OF_QUESTIONS_GROUP1);

			// Select random from group2
			const shuffledGroup2 = [...questions.group2].sort(() => 0.5 - Math.random());
			const selectedFromGroup2 = shuffledGroup2.slice(0, NUMBER_OF_QUESTIONS_GROUP2);

			// Combine and shuffle all selected questions
			const combinedQuestions = [...selectedFromGroup1, ...selectedFromGroup2].sort(
				() => 0.5 - Math.random()
			);
			const originalIds = combinedQuestions.map((q) => q.id);
			initializeLevel2Questions(originalIds);
		}
	});

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<Layout1>
	<QuestionCard
		{currentQuestion}
		{currentQuestionIndex}
		{personImagePath}
		onAnswerSelect={handleAnswerSelect}
		{showColorFeedback}
		{totalQuestions}
		answers={answersMap}
	/>
</Layout1>
