import { createLevelQuestionsStore } from './levelQuestionsStore';
import { createLevelGameStore } from './levelGameStore';
import type { LevelQuestionsStoreInstance } from './levelQuestionsStore';
import type { LevelGameStoreInstance } from './levelGameStore';

export const level1 = createLevelQuestionsStore(1);
export const level2 = createLevelQuestionsStore(2);
export const level3 = createLevelGameStore(3);
export const level4 = createLevelGameStore(4);
export const level5 = createLevelGameStore(5);
export const level6 = createLevelGameStore(6);

const LEVEL_STORES = {
	1: level1,
	2: level2,
	3: level3,
	4: level4,
	5: level5,
	6: level6
} as const;

export type LevelNumber = keyof typeof LEVEL_STORES;
export type LevelStoreInstance = LevelQuestionsStoreInstance | LevelGameStoreInstance;

export function clearAllStores() {
	Object.values(LEVEL_STORES).forEach((store) => store.remove());
}
