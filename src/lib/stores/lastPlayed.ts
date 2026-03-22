import { persisted } from 'svelte-persisted-store';

export interface LastPlayedState {
	levelNumber: number | null;
	firstThreeStarsLevelNumber: number | null;
}

// Store for persisting the last played level and first level with 3 stars
export const lastPlayedStore = persisted<LastPlayedState>('last-played-level', {
	levelNumber: null,
	firstThreeStarsLevelNumber: null
});

// Helper function to update last played level
export function setLastPlayed(levelNumber: number) {
	lastPlayedStore.update((state) => ({
		...state,
		levelNumber
	}));
}

// Helper function to set first three stars level
export function setFirstThreeStars(levelNumber: number) {
	lastPlayedStore.update((state) => ({
		...state,
		firstThreeStarsLevelNumber: levelNumber
	}));
}

// Helper function to clear last played
export function clearLastPlayed() {
	lastPlayedStore.update((state) => ({
		...state,
		levelNumber: null
	}));
}

// Helper function to clear first three stars
export function clearFirstThreeStars() {
	lastPlayedStore.update((state) => ({
		...state,
		firstThreeStarsLevelNumber: null
	}));
}

// Helper function to clear all
export function clearAll() {
	lastPlayedStore.set({
		levelNumber: null,
		firstThreeStarsLevelNumber: null
	});
}
