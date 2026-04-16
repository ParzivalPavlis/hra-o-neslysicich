import type { LevelVideosState } from '$lib/types/store';
import { persisted } from 'svelte-persisted-store';

// Store for persisting the complete level 8 game state
export const level8GameState = persisted<LevelVideosState>('level8-game-state', {
	currentAnswerIndex: 0,
	completed: false,
	lives: 4,
	answers: []
});

// Helper functions for managing the game state
export function initializeLevel8Game() {
	level8GameState.set({
		currentAnswerIndex: 0,
		completed: false,
		lives: 4,
		answers: []
	});
}

export function updateCurrentAnswer(answerIndex: number) {
	level8GameState.update((state) => ({
		...state,
		currentAnswerIndex: answerIndex
	}));
}

export function decreaseLives() {
	level8GameState.update((state) => ({
		...state,
		lives: Math.max(0, state.lives - 1)
	}));
}

export function addAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
	level8GameState.update((state) => ({
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

export function markLevel8Completed() {
	level8GameState.update((state) => ({
		...state,
		completed: true
	}));
}

export function clearLevel8GameState() {
	level8GameState.set({
		currentAnswerIndex: 0,
		completed: false,
		lives: 4,
		answers: []
	});
}
