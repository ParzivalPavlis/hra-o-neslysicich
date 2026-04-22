import { persisted } from 'svelte-persisted-store';

type WalkingGameState = {
	completed: boolean;
	objectsVisited: string[];
	lastWorldX: number | null;
};

const DEFAULT_STATE: WalkingGameState = {
	completed: false,
	objectsVisited: [],
	lastWorldX: null
};

export function createLevelWalkingStore(levelNumber: number) {
	const store = persisted<WalkingGameState>(
		`level${levelNumber}-walking-state`,
		{ ...DEFAULT_STATE },
		{ storage: 'session' }
	);

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

	function savePosition(x: number) {
		store.update((s) => ({ ...s, lastWorldX: x }));
	}

	function clearPosition() {
		store.update((s) => ({ ...s, lastWorldX: null }));
	}

	function clear() {
		store.set({ ...DEFAULT_STATE });
	}

	function remove() {
		sessionStorage.removeItem(`level${levelNumber}-walking-state`);
	}

	return {
		store,
		initialize,
		visitObject,
		markCompleted,
		savePosition,
		clearPosition,
		clear,
		remove
	};
}

export type LevelWalkingStoreInstance = ReturnType<typeof createLevelWalkingStore>;
