import type { LevelQuestionsState } from '$lib/types/store';
import { persisted } from 'svelte-persisted-store';

// Store for persisting the complete level 1 questions state
export const level1QuestionsState = persisted<LevelQuestionsState>('level1-questions-state', {
	questionIds: [],
	completed: false,
	currentQuestionIndex: 1,
	answers: []
});

// Helper functions for managing the questions state
export function initializeLevel1Questions(questionIds: number[]) {
	level1QuestionsState.set({
		questionIds,
		completed: false,
		currentQuestionIndex: 1,
		answers: []
	});
}

export function updateCurrentQuestion(questionIndex: number) {
	level1QuestionsState.update((state) => ({
		...state,
		currentQuestionIndex: questionIndex
	}));
}

export function addQuestionAnswer(
	questionId: number,
	selectedOptionId: string,
	isCorrect: boolean
) {
	level1QuestionsState.update((state) => ({
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

export function markLevel1QuestionsCompleted() {
	level1QuestionsState.update((state) => ({
		...state,
		completed: true
	}));
}

export function clearLevel1QuestionsState() {
	level1QuestionsState.set({
		questionIds: [],
		completed: false,
		currentQuestionIndex: 1,
		answers: []
	});
}
