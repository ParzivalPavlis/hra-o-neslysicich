import type { LevelTrailVariants } from '$lib/types/levelTrails';

export type LevelButtonType = {
	level?: number;
	stars: number;
	locked: boolean;
	description: string;
	trails?: LevelTrailVariants;
};
