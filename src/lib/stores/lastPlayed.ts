import { persisted } from 'svelte-persisted-store';

export interface LastPlayedState {
	level: number | null;
	firstThreeStars: number | null;
}

// Store for persisting the last played level and first level with 3 stars
export const lastPlayedStore = persisted<LastPlayedState>('last-played-level', {
	level: null,
	firstThreeStars: null
});

// Helper function to update last played level
export function setLastPlayed(levelNumber: number) {
	lastPlayedStore.update((state) => ({
		...state,
		level: levelNumber
	}));
}

// Helper function to set first three stars level
export function setFirstThreeStars(levelNumber: number) {
	lastPlayedStore.update((state) => ({
		...state,
		firstThreeStars: levelNumber
	}));
}

// Helper function to clear last played
export function clearLastPlayed() {
	lastPlayedStore.update((state) => ({
		...state,
		level: null
	}));
}

// Helper function to clear first three stars
export function clearFirstThreeStars() {
	lastPlayedStore.update((state) => ({
		...state,
		firstThreeStars: null
	}));
}

// Helper function to clear all
export function clearAll() {
	lastPlayedStore.set({
		level: null,
		firstThreeStars: null
	});
}
