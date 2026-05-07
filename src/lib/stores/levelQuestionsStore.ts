import type { LevelQuestionsState } from '$lib/types/store';
import { persisted } from 'svelte-persisted-store';

const DEFAULT_STATE: LevelQuestionsState = {
	questionIds: [],
	completed: false,
	currentQuestionIndex: 1,
	answers: []
};

// Creates a persisted session store for a questions-type level
export function createLevelQuestionsStore(levelNumber: number) {
	const store = persisted<LevelQuestionsState>(
		`level${levelNumber}-questions-state`,
		{ ...DEFAULT_STATE },
		{ storage: 'session' }
	);

	// Resets store and sets the active question IDs
	function initialize(questionIds: number[]) {
		store.set({ ...DEFAULT_STATE, questionIds });
	}

	// Sets the current question index
	function updateCurrentQuestion(index: number) {
		store.update((s) => ({ ...s, currentQuestionIndex: index }));
	}

	// Appends a new answer record
	function addAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
		store.update((s) => ({
			...s,
			answers: [...s.answers, { questionId, selectedOptionId, isCorrect }]
		}));
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
		sessionStorage.removeItem(`level${levelNumber}-questions-state`);
	}

	return { store, initialize, updateCurrentQuestion, addAnswer, markCompleted, clear, remove };
}

export type LevelQuestionsStoreInstance = ReturnType<typeof createLevelQuestionsStore>;
