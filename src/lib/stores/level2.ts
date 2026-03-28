import { persisted } from 'svelte-persisted-store';

export interface Level2QuestionsState {
	questionIds: number[]; // Store original question IDs from source data
	currentQuestionIndex: number;
	answers: Array<{
		questionId: number;
		selectedOptionId: string;
		isCorrect: boolean;
	}>;
}

// Store for persisting the complete level 2 questions state
export const level2QuestionsState = persisted<Level2QuestionsState>('level2-questions-state', {
	questionIds: [],
	currentQuestionIndex: 1,
	answers: []
});

// Helper functions for managing the questions state
export function initializeLevel2Questions(questionIds: number[]) {
	level2QuestionsState.set({
		questionIds,
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

export function clearLevel2QuestionsState() {
	level2QuestionsState.set({
		questionIds: [],
		currentQuestionIndex: 1,
		answers: []
	});
}
