import type { LevelQuestionsState } from '$lib/types/store';
import { persisted } from 'svelte-persisted-store';

const DEFAULT_STATE: LevelQuestionsState = {
	questionIds: [],
	completed: false,
	currentQuestionIndex: 1,
	answers: []
};

export function createLevelQuestionsStore(levelNumber: number) {
	const store = persisted<LevelQuestionsState>(`level${levelNumber}-questions-state`, {
		...DEFAULT_STATE
	});

	function initialize(questionIds: number[]) {
		store.set({ ...DEFAULT_STATE, questionIds });
	}

	function updateCurrentQuestion(index: number) {
		store.update((s) => ({ ...s, currentQuestionIndex: index }));
	}

	function addAnswer(questionId: number, selectedOptionId: string, isCorrect: boolean) {
		store.update((s) => ({
			...s,
			answers: [...s.answers, { questionId, selectedOptionId, isCorrect }]
		}));
	}

	function markCompleted() {
		store.update((s) => ({ ...s, completed: true }));
	}

	function clear() {
		store.set({ ...DEFAULT_STATE });
	}

	return { store, initialize, updateCurrentQuestion, addAnswer, markCompleted, clear };
}

export type LevelQuestionsStoreInstance = ReturnType<typeof createLevelQuestionsStore>;
