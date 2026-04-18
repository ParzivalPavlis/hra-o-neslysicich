import { createLevelQuestionsStore } from './levelQuestionsStore';
import { createLevelGameStore } from './levelGameStore';
import { createLevelWalkingStore } from './levelWalkingStore';
import type { LevelQuestionsStoreInstance } from './levelQuestionsStore';
import type { LevelGameStoreInstance } from './levelGameStore';

export const level1 = createLevelQuestionsStore(1);
export const level2 = createLevelQuestionsStore(2);
export const level4 = createLevelGameStore(4);
export const level5 = createLevelGameStore(5);
export const level7 = createLevelGameStore(7);
export const level8 = createLevelGameStore(8);
export const level9 = createLevelWalkingStore(9);

const LEVEL_STORES = {
	1: level1,
	2: level2,
	4: level4,
	5: level5,
	7: level7,
	8: level8
} as const;

export type LevelNumber = keyof typeof LEVEL_STORES;
export type LevelStoreInstance = LevelQuestionsStoreInstance | LevelGameStoreInstance;

export function getLevelStore(levelNumber: LevelNumber): LevelStoreInstance {
	return LEVEL_STORES[levelNumber];
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
 * Type guard — true when the store is a game-type level (4, 5, 7, 8).
 */
export function isGameStore(instance: LevelStoreInstance): instance is LevelGameStoreInstance {
	return 'decreaseLives' in instance;
}
