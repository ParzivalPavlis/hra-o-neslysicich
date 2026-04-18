import type { LevelVideosState } from '$lib/types/store';
import { persisted } from 'svelte-persisted-store';

const DEFAULT_STATE: LevelVideosState = {
	currentAnswerIndex: 0,
	completed: false,
	lives: 4,
	answers: []
};

export function createLevelGameStore(levelNumber: number) {
	const store = persisted<LevelVideosState>(`level${levelNumber}-game-state`, { ...DEFAULT_STATE });

	function initialize() {
		store.set({ ...DEFAULT_STATE });
	}

	function updateCurrentAnswer(index: number) {
		store.update((s) => ({ ...s, currentAnswerIndex: index }));
	}

	function decreaseLives() {
		store.update((s) => ({ ...s, lives: Math.max(0, s.lives - 1) }));
	}

	function addAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
		store.update((s) => ({
			...s,
			answers: [...s.answers, { questionId, selectedOptionId, isCorrect }]
		}));
	}

	function modifyAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
		store.update((s) => {
			const existing = s.answers.findIndex((a) => a.questionId === questionId);
			if (existing !== -1) {
				return {
					...s,
					answers: s.answers.map((a) =>
						a.questionId === questionId ? { questionId, selectedOptionId, isCorrect } : a
					)
				};
			}
			return { ...s, answers: [...s.answers, { questionId, selectedOptionId, isCorrect }] };
		});
	}

	function markCompleted() {
		store.update((s) => ({ ...s, completed: true }));
	}

	function clear() {
		store.set({ ...DEFAULT_STATE });
	}

	return {
		store,
		initialize,
		updateCurrentAnswer,
		decreaseLives,
		addAnswer,
		modifyAnswer,
		markCompleted,
		clear
	};
}

export type LevelGameStoreInstance = ReturnType<typeof createLevelGameStore>;
