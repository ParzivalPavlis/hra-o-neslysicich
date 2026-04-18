import { persisted } from 'svelte-persisted-store';

type WalkingGameState = {
	completed: boolean;
	objectsVisited: string[];
};

const DEFAULT_STATE: WalkingGameState = {
	completed: false,
	objectsVisited: []
};

export function createLevelWalkingStore(levelNumber: number) {
	const store = persisted<WalkingGameState>(`level${levelNumber}-walking-state`, {
		...DEFAULT_STATE
	});

	function initialize() {
		store.set({ ...DEFAULT_STATE });
	}

	function visitObject(objectId: string) {
		store.update((s) => ({
			...s,
			objectsVisited: s.objectsVisited.includes(objectId)
				? s.objectsVisited
				: [...s.objectsVisited, objectId]
		}));
	}

	function markCompleted() {
		store.update((s) => ({ ...s, completed: true }));
	}

	function clear() {
		store.set({ ...DEFAULT_STATE });
	}

	return { store, initialize, visitObject, markCompleted, clear };
}

export type LevelWalkingStoreInstance = ReturnType<typeof createLevelWalkingStore>;
