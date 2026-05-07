import type { LevelVideosState } from '$lib/types/store';
import { persisted } from 'svelte-persisted-store';

const DEFAULT_STATE: LevelVideosState = {
	currentAnswerIndex: 0,
	completed: false,
	lives: 4,
	answers: []
};

// Creates a persisted session store for a game-type level
export function createLevelGameStore(levelNumber: number) {
	const store = persisted<LevelVideosState>(
		`level${levelNumber}-game-state`,
		{ ...DEFAULT_STATE },
		{ storage: 'session' }
	);

	// Resets store to default state
	function initialize() {
		store.set({ ...DEFAULT_STATE });
	}

	// Sets the current answer index
	function updateCurrentAnswer(index: number) {
		store.update((s) => ({ ...s, currentAnswerIndex: index }));
	}

	// Decrements lives by 1, minimum 0
	function decreaseLives() {
		store.update((s) => ({ ...s, lives: Math.max(0, s.lives - 1) }));
	}

	// Appends a new answer record
	function addAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
		store.update((s) => ({
			...s,
			answers: [...s.answers, { questionId, selectedOptionId, isCorrect }]
		}));
	}

	// Updates an existing answer or appends it if not found
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

	// Marks the level as completed
	function markCompleted() {
		store.update((s) => ({ ...s, completed: true }));
	}

	// Resets store to default state
	function clear() {
		store.set({ ...DEFAULT_STATE });
	}

	// Removes the persisted entry from sessionStorage
	function remove() {
		sessionStorage.removeItem(`level${levelNumber}-game-state`);
	}

	return {
		store,
		initialize,
		updateCurrentAnswer,
		decreaseLives,
		addAnswer,
		modifyAnswer,
		markCompleted,
		clear,
		remove
	};
}

export type LevelGameStoreInstance = ReturnType<typeof createLevelGameStore>;
