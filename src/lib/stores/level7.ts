import { persisted } from 'svelte-persisted-store';
import type { LevelVideosState } from '$lib/types/store';

// Store for persisting the complete level 7 game state
export const level7GameState = persisted<LevelVideosState>('level7-game-state', {
	currentAnswerIndex: 0,
	lives: 4,
	answers: []
});

// Helper functions for managing the game state
export function initializeLevel7Game() {
	level7GameState.set({
		currentAnswerIndex: 0,
		lives: 4,
		answers: []
	});
}

export function updateCurrentAnswer(answerIndex: number) {
	level7GameState.update((state) => ({
		...state,
		currentAnswerIndex: answerIndex
	}));
}

export function decreaseLives() {
	level7GameState.update((state) => ({
		...state,
		lives: Math.max(0, state.lives - 1)
	}));
}

export function addAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
	level7GameState.update((state) => ({
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

export function modifyAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
	level7GameState.update((state) => {
		const existingAnswerIndex = state.answers.findIndex((a) => a.questionId === questionId);

		if (existingAnswerIndex !== -1) {
			// Answer exists, modify it
			return {
				...state,
				answers: state.answers.map((answer) =>
					answer.questionId === questionId ? { questionId, selectedOptionId, isCorrect } : answer
				)
			};
		} else {
			// Answer doesn't exist, add it
			return {
				...state,
				answers: [
					...state.answers,
					{
						questionId,
						selectedOptionId,
						isCorrect
					}
				]
			};
		}
	});
}

export function clearLevel7GameState() {
	level7GameState.set({
		currentAnswerIndex: 0,
		lives: 4,
		answers: []
	});
}
