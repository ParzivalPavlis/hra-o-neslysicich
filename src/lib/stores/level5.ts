import type { LevelVideosState } from '$lib/types/store';
import { persisted } from 'svelte-persisted-store';

// Store for persisting the complete level 5 game state
export const level5GameState = persisted<LevelVideosState>('level5-game-state', {
	currentAnswerIndex: 0,
	lives: 4,
	answers: []
});

// Helper functions for managing the game state
export function initializeLevel5Game() {
	level5GameState.set({
		currentAnswerIndex: 0,
		lives: 4,
		answers: []
	});
}

export function updateCurrentAnswer(answerIndex: number) {
	level5GameState.update((state) => ({
		...state,
		currentAnswerIndex: answerIndex
	}));
}

export function decreaseLives() {
	level5GameState.update((state) => ({
		...state,
		lives: Math.max(0, state.lives - 1)
	}));
}

export function addAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
	level5GameState.update((state) => ({
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

export function clearLevel5GameState() {
	level5GameState.set({
		currentAnswerIndex: 0,
		lives: 4,
		answers: []
	});
}
