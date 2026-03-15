import { persisted } from 'svelte-persisted-store';

export interface LastPlayedState {
	levelNumber: number | null;
}

// Store for persisting the last played level
export const lastPlayedStore = persisted<LastPlayedState>('last-played-level', {
	levelNumber: null
});

// Helper function to update last played level
export function setLastPlayed(levelNumber: number) {
	lastPlayedStore.set({
		levelNumber
	});
}

// Helper function to clear last played
export function clearLastPlayed() {
	lastPlayedStore.set({
		levelNumber: null
	});
}
