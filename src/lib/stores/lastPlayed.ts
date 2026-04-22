import { goto } from '$app/navigation';
import { persisted } from 'svelte-persisted-store';

export interface LastPlayedState {
	level: number | null;
	firstThreeStars: number | null;
	justUnlockedLevel: number | null;
	isPlaying: number | null;
}

// Store for persisting the last played level and first level with 3 stars
export const lastPlayedStore = persisted<LastPlayedState>(
	'last-played-level',
	{
		level: null,
		firstThreeStars: null,
		justUnlockedLevel: null,
		isPlaying: null
	},
	{ storage: 'session' }
);

// Helper function to update last played level
export function setLastPlayed(levelNumber: number) {
	lastPlayedStore.update((state) => ({
		...state,
		level: levelNumber,
		isPlaying: levelNumber
	}));
}

// Helper function to set first three stars level
export function setFirstThreeStars(levelNumber: number) {
	lastPlayedStore.update((state) => ({
		...state,
		firstThreeStars: levelNumber
	}));
}

// Helper function to set just unlocked level
export function setJustUnlockedLevel(levelNumber: number) {
	lastPlayedStore.update((state) => ({
		...state,
		justUnlockedLevel: levelNumber
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

// Helper function to clear just unlocked level
export function clearJustUnlockedLevel() {
	lastPlayedStore.update((state) => ({
		...state,
		justUnlockedLevel: null
	}));
}

export function clearIsPlaying() {
	lastPlayedStore.update((state) => ({
		...state,
		isPlaying: null
	}));
}

// Helper function to clear all
export function clearAll() {
	lastPlayedStore.set({
		level: null,
		firstThreeStars: null,
		justUnlockedLevel: null,
		isPlaying: null
	});
}

export function checkIsPlaying(levelNumber: number) {
	let isPlaying = false;
	lastPlayedStore.subscribe((state) => {
		isPlaying = state.isPlaying === levelNumber;
	});

	if (!isPlaying) {
		goto(`/levels/${levelNumber}/intro`);
	}
}
