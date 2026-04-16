<script lang="ts">
	import { goto } from '$app/navigation';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import QuestionCard from '$components/QuestionCard.svelte';
	import questions from '$lib/levels/1/questions';
	import { buildQuestionsFromIds, pickRandomIds } from '$lib/client/shared/questionsUtils';
	import { level1 } from '$lib/stores/gameState';
	import type { QuestionOptionType } from '$types/question';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 1;
	const NUMBER_OF_QUESTIONS = 8;
	const level1State = level1.store;

	let selectedAnswer = $state<string | null>(null);
	let showingFeedback = $state(false);
	let isCorrect = $state(false);
	let personImage = $state<'man_thinking' | 'man_correct' | 'man_wrong'>('man_thinking');
	let questionsState = $derived($level1State);
	let questionIds = $derived(questionsState.questionIds);
	let currentQuestionIndex = $derived(questionsState.currentQuestionIndex);

	let selectedQuestions = $derived(() => {
		if (!questionIds || questionIds.length === 0) return [];
		return buildQuestionsFromIds(questions.group1, questionIds);
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
		level1.addAnswer(currentQuestionIndex, option.id, option.correct);

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
			level1.updateCurrentQuestion(nextIndex);
		} else {
			level1.markCompleted();
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/overview`);
		}
	}

	function showColorFeedback(optionId: string) {
		if (!showingFeedback || selectedAnswer !== optionId) return 1;
		return isCorrect ? 2 : 3;
	}

	$effect(() => {
		const storedState = $level1State;
		if (!storedState.questionIds || storedState.questionIds.length === 0) {
			level1.initialize(pickRandomIds(questions.group1, NUMBER_OF_QUESTIONS));
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
