import { persisted } from 'svelte-persisted-store';

export interface Level4Answer {
	answerIndex: number;
	selectedOptionId: string;
	isCorrect: boolean;
}

export interface Level4GameState {
	currentAnswerIndex: number;
	lives: number;
	answers: Level4Answer[];
}

// Store for persisting the complete level 4 game state
export const level4GameState = persisted<Level4GameState>('level4-game-state', {
	currentAnswerIndex: 0,
	lives: 4,
	answers: []
});

// Helper functions for managing the game state
export function initializeLevel4Game() {
	level4GameState.set({
		currentAnswerIndex: 0,
		lives: 4,
		answers: []
	});
}

export function updateCurrentAnswer(answerIndex: number) {
	level4GameState.update((state) => ({
		...state,
		currentAnswerIndex: answerIndex
	}));
}

export function decreaseLives() {
	level4GameState.update((state) => ({
		...state,
		lives: Math.max(0, state.lives - 1)
	}));
}

export function addAnswer(answerIndex: number, selectedOptionId: string, isCorrect: boolean) {
	level4GameState.update((state) => ({
		...state,
		answers: [
			...state.answers,
			{
				answerIndex,
				selectedOptionId,
				isCorrect
			}
		]
	}));
}

export function clearLevel4GameState() {
	level4GameState.set({
		currentAnswerIndex: 0,
		lives: 4,
		answers: []
	});
}
