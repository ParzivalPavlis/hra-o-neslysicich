import type { LevelTrailVariants } from '$lib/types/levelTrails';
import type { Component } from 'svelte';

export type LevelButtonType = {
	icon: Component;
	level?: number;
	stars: number;
	locked: boolean;
	description: string;
	trails?: LevelTrailVariants;
};
