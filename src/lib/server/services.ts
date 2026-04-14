import { supabaseBrowserClient } from '$lib/client/supabase';
import { supabaseAdminClient } from '$lib/server/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { GameProgressType, LevelProgressType } from '$types/supabase/gameProgress';
import type { Database } from '$types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get a user from auth.users by email
 * @param {string} email - The email address to search for
 * @returns {Promise<User|null>} The user object or null if not found
 */
export async function getUserByEmail(email: string): Promise<User | null> {
	const { data, error } = await supabaseAdminClient.auth.admin.listUsers();

	if (error) {
		console.error('Error fetching user by email:', error);
		return null;
	}

	return data.users.find((user) => user.email === email) || null;
}

/**
 * List all users from auth.users
 * @returns {Promise<User[]>} Array of all user objects
 */
export async function listAllUsers(): Promise<User[]> {
	const { data, error } = await supabaseAdminClient.auth.admin.listUsers();

	if (error) {
		console.error('Error listing users:', error);
		return [];
	}

	return data.users;
}

/**
 * Initialize game progress for a new user
 * @param {string} userId - The user ID to create progress for
 * @returns {Promise<GameProgressType|null>} The created game progress record or null if failed
 */
export async function initializeGameProgress(userId: string): Promise<GameProgressType | null> {
	const gameProgress: GameProgressType = {
		levels: {
			level1: { stars: 0, lastPlayed: true, locked: false },
			level2: { stars: 0, locked: true },
			level3: { stars: 0, locked: true },
			level4: { stars: 0, locked: false },
			level5: { stars: 0, locked: true },
			level6: { stars: 0, locked: true },
			level7: { stars: 0, locked: false },
			level8: { stars: 0, locked: true },
			level9: { stars: 0, locked: true },
			level10: { stars: 0, locked: true },
			level11: { stars: 0, locked: true },
			level12: { stars: 0, locked: true }
		}
	};

	const { data, error } = await supabaseAdminClient
		.from('game_progress')
		.insert({
			user_id: userId,
			progress: gameProgress
		})
		.select()
		.single();

	if (error) {
		console.error('Error initializing game progress:', error);
		return null;
	}

	return data?.progress as GameProgressType | null;
}

/**
 * Get game progress for the currently logged in user
 * @param {string} userId - The user ID to fetch progress for
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<GameProgressType|null>} The game progress object or null if not found
 */
export async function getGameProgress(
	userId: string,
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<GameProgressType | null> {
	// Optimized query: only select progress column (smaller payload)
	// Make sure user_id column has a database index for faster queries
	const { data, error } = await client
		.from('game_progress')
		.select('progress', { count: 'exact' })
		.eq('user_id', userId)
		.maybeSingle();

	if (error) {
		console.error('Error fetching game progress:', error);
		return null;
	}

	return data?.progress as GameProgressType | null;
}

/**
 * Get game progress by record ID
 * @param {number} id - The game progress record ID
 * @returns {Promise<GameProgressType|null>} The game progress record or null if not found
 */
export async function getGameProgressById(id: number): Promise<GameProgressType | null> {
	const { data, error } = await supabaseBrowserClient
		.from('game_progress')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching game progress by ID:', error);
		return null;
	}

	return data?.progress as GameProgressType | null;
}

/**
 * Update game progress for a user
 * @param {string} userId - The user ID to update progress for
 * @param {GameProgressType} progress - The updated game progress object
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<GameProgressType|null>} The updated progress object or null if failed
 */
export async function updateGameProgress(
	userId: string,
	progress: GameProgressType,
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<GameProgressType | null> {
	const { data, error } = await client
		.from('game_progress')
		.update({ progress })
		.eq('user_id', userId)
		.select('progress')
		.single();

	if (error) {
		console.error('Error updating game progress:', error);
		return null;
	}

	return data?.progress as GameProgressType | null;
}

/**
 * Update a specific level's attributes in game progress
 * @param {string} userId - The user ID to update progress for
 * @param {number} levelNumber - The level number
 * @param {Object} attributes - The attributes to update
 * @param {number} [attributes.stars] - Stars earned
 * @param {boolean} [attributes.locked] - Whether the level is locked
 * @param {boolean} [attributes.completed] - Whether the level is completed
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<GameProgressType|null>} The updated progress object or null if failed
 */
export async function updateLevelProgress(
	userId: string,
	levelNumber: number,
	attributes: LevelProgressType,
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<GameProgressType | null> {
	// Get current progress
	const currentProgress = await getGameProgress(userId, client);

	if (!currentProgress) {
		console.error('No game progress found for user:', userId);
		return null;
	}

	// Get the level key
	const levelKey = `level${levelNumber}` as keyof GameProgressType['levels'];

	// Update the specific level attributes
	const updatedProgress: GameProgressType = {
		...currentProgress,
		levels: {
			...currentProgress.levels,
			[levelKey]: {
				...currentProgress.levels[levelKey],
				...attributes
			}
		}
	};

	// Save the updated progress
	return updateGameProgress(userId, updatedProgress, client);
}

/**
 * Mark a level as played for a user (only if not already played)
 * @param {string} userId - The user ID to update progress for
 * @param {number} levelNumber - The level number to mark as played
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<boolean | 'already-played'>} True if level was marked as played or was already played, false if failed
 */
export async function setPlayedLevel(
	userId: string,
	levelNumber: number,
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<boolean | 'already-played'> {
	// Get current progress
	const currentProgress = await getGameProgress(userId, client);

	if (!currentProgress) {
		console.error('No game progress found for user:', userId);
		return false;
	}

	// Get the level key
	const levelKey = `level${levelNumber}` as keyof GameProgressType['levels'];

	// Check if level is already played
	if (currentProgress.levels[levelKey].played) {
		return 'already-played';
	}

	// Update the specific level's played property
	const updatedProgress: GameProgressType = {
		...currentProgress,
		levels: {
			...currentProgress.levels,
			[levelKey]: {
				...currentProgress.levels[levelKey],
				played: true
			}
		}
	};

	// Save the updated progress
	const result = await updateGameProgress(userId, updatedProgress, client);

	return result !== null;
}

/**
 * Set a level as lastPlayed and reset lastPlayed for all other levels
 * @param {string} userId - The user ID to update progress for
 * @param {number} levelNumber - The level number to set as lastPlayed
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<boolean>} True if level was set as lastPlayed, false if failed
 */
export async function setLastPlayedLevel(
	userId: string,
	levelNumber: number,
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<boolean> {
	// Get current progress
	const currentProgress = await getGameProgress(userId, client);

	if (!currentProgress) {
		console.error('No game progress found for user:', userId);
		return false;
	}

	// Get the level key
	const levelKey = `level${levelNumber}` as keyof GameProgressType['levels'];

	// Update all levels to reset lastPlayed, then set the specific level to true
	const updatedLevels = Object.entries(currentProgress.levels).reduce(
		(acc, [key, level]) => {
			acc[key as keyof GameProgressType['levels']] = {
				...level,
				lastPlayed: key === levelKey
			};
			return acc;
		},
		{} as GameProgressType['levels']
	);

	const updatedProgress: GameProgressType = {
		...currentProgress,
		levels: updatedLevels
	};

	// Save the updated progress
	const result = await updateGameProgress(userId, updatedProgress, client);

	return result !== null;
}

/**
 * Get attributes of a specific level
 * @param {string} userId - The user ID to fetch progress for
 * @param {number} levelNumber - The level number
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<LevelProgressType|null>} The level's attributes or null if not found
 */
export async function getLevelProgress(
	userId: string,
	levelNumber: number,
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<LevelProgressType | null> {
	// Get the full game progress
	const gameProgress = await getGameProgress(userId, client);

	if (!gameProgress) {
		console.error('No game progress found for user:', userId);
		return null;
	}

	// Get the level key
	const levelKey = `level${levelNumber}` as keyof GameProgressType['levels'];

	// Return the specific level's attributes
	return gameProgress.levels[levelKey] || null;
}

/**
 * Unlock level for a user
 * @param {string} userId - The user ID to update progress for
 * @param {number} levelNumber - The level number to unlock
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<boolean>} True if next level was unlocked or was already unlocked, false if failed
 */
export async function unlockLevel(
	userId: string,
	levelNumber: number,
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<boolean> {
	const nextLevelKey = `level${levelNumber}` as keyof GameProgressType['levels'];

	// Get current progress
	const gameProgress = await getGameProgress(userId, client);

	if (!gameProgress) {
		console.error('No game progress found for user:', userId);
		return false;
	}

	// Check if next level exists
	if (!gameProgress.levels[nextLevelKey]) {
		console.warn(`Level ${levelNumber} does not exist`);
		return false;
	}

	// Check if next level is already unlocked
	if (!gameProgress.levels[nextLevelKey].locked) {
		return true;
	}

	// Unlock the next level
	const result = await updateLevelProgress(
		userId,
		levelNumber,
		{ stars: 0, locked: false },
		client
	);

	return result !== null;
}

/**
 * Safely get the current session and user
 * @param {SupabaseClient<Database>} client - The authenticated Supabase client
 * @returns {Promise<{session: Session; user: User} | {session: null; user: null}>} Session and user if authenticated, or null values if not
 */
export async function safeGetSession(
	client: SupabaseClient<Database> = supabaseBrowserClient as SupabaseClient<Database>
): Promise<{ session: Session; user: User } | { session: null; user: null }> {
	const {
		data: { session }
	} = await client.auth.getSession();

	if (!session) {
		return { session: null, user: null };
	}

	const {
		data: { user },
		error
	} = await client.auth.getUser();

	if (error || user === null) {
		return { session: null, user: null };
	}

	return { session, user };
}
