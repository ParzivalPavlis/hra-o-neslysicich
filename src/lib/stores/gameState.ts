import { createLevelQuestionsStore } from './levelQuestionsStore';
import { createLevelGameStore } from './levelGameStore';
import { createLevelWalkingStore } from './levelWalkingStore';
import type { LevelQuestionsStoreInstance } from './levelQuestionsStore';
import type { LevelGameStoreInstance } from './levelGameStore';
import type { LevelWalkingStoreInstance } from './levelWalkingStore';

export const level1 = createLevelQuestionsStore(1);
export const level2 = createLevelQuestionsStore(2);
export const level3 = createLevelGameStore(3);
export const level4 = createLevelGameStore(4);
export const level5 = createLevelGameStore(5);
export const level6 = createLevelGameStore(6);
export const level7 = createLevelWalkingStore(7);

const LEVEL_STORES = {
	1: level1,
	2: level2,
	3: level3,
	4: level4,
	5: level5,
	6: level6,
	7: level7
} as const;

export type LevelNumber = keyof typeof LEVEL_STORES;
export type LevelStoreInstance =
	| LevelQuestionsStoreInstance
	| LevelGameStoreInstance
	| LevelWalkingStoreInstance;

export function getLevelStore(levelNumber: LevelNumber): LevelStoreInstance {
	return LEVEL_STORES[levelNumber];
}

export function clearAllStores() {
	Object.values(LEVEL_STORES).forEach((store) => store.remove());
}

/**
 * Type guard — true when the store is a questions-type level (1, 2).
 */
export function isQuestionsStore(
	instance: LevelStoreInstance
): instance is LevelQuestionsStoreInstance {
	return 'initialize' in instance && instance.initialize.length === 1;
}

/**
 * Type guard — true when the store is a game-type level (3, 4, 5, 6).
 */
export function isGameStore(instance: LevelStoreInstance): instance is LevelGameStoreInstance {
	return 'decreaseLives' in instance;
}
