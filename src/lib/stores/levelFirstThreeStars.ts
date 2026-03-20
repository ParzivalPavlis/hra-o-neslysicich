import { persisted } from 'svelte-persisted-store';

export interface LevelFirstThreeStarsState {
	levelNumber: number | null;
}

// Store for persisting the first level where user achieved 3 stars
export const levelFirstThreeStarsStore = persisted<LevelFirstThreeStarsState>(
	'level-first-three-stars',
	{
		levelNumber: null
	}
);

// Helper function to set first three stars level
export function setFirstThreeStars(levelNumber: number) {
	levelFirstThreeStarsStore.set({
		levelNumber
	});
}

// Helper function to clear first three stars
export function clearFirstThreeStars() {
	levelFirstThreeStarsStore.set({
		levelNumber: null
	});
}
