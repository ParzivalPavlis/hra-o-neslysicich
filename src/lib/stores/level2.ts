import { persisted } from 'svelte-persisted-store';
import type { LevelQuestionsState } from '$lib/types/store';

// Store for persisting the complete level 2 questions state
export const level2QuestionsState = persisted<LevelQuestionsState>('level2-questions-state', {
	questionIds: [],
	completed: false,
	currentQuestionIndex: 1,
	answers: []
});

// Helper functions for managing the questions state
export function initializeLevel2Questions(questionIds: number[]) {
	level2QuestionsState.set({
		questionIds,
		completed: false,
		currentQuestionIndex: 1,
		answers: []
	});
}

export function updateCurrentQuestion(questionIndex: number) {
	level2QuestionsState.update((state) => ({
		...state,
		currentQuestionIndex: questionIndex
	}));
}

export function addQuestionAnswer(
	questionId: number,
	selectedOptionId: string,
	isCorrect: boolean
) {
	level2QuestionsState.update((state) => ({
		...state,
		answers: [
			...state.answers,
			{
				questionId,
				selectedOptionId,
				isCorrect
			}
		]
	}));
}

export function markLevel2QuestionsCompleted() {
	level2QuestionsState.update((state) => ({
		...state,
		completed: true
	}));
}

export function clearLevel2QuestionsState() {
	level2QuestionsState.set({
		questionIds: [],
		completed: false,
		currentQuestionIndex: 1,
		answers: []
	});
}
