import { persisted } from 'svelte-persisted-store';

export interface Level1QuestionsState {
	questionIds: number[]; // Store original question IDs from source data
	currentQuestionIndex: number;
	answers: Array<{
		questionId: number;
		selectedOptionId: string;
		isCorrect: boolean;
	}>;
}

// Store for persisting the complete level 1 questions state
export const level1QuestionsState = persisted<Level1QuestionsState>('level1-questions-state', {
	questionIds: [],
	currentQuestionIndex: 1,
	answers: []
});

// Helper functions for managing the questions state
export function initializeLevel1Questions(questionIds: number[]) {
	level1QuestionsState.set({
		questionIds,
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

export function clearLevel1QuestionsState() {
	level1QuestionsState.set({
		questionIds: [],
		currentQuestionIndex: 1,
		answers: []
	});
}
