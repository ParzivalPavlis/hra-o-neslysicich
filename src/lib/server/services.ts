import { supabase, supabaseAdmin } from './supabaseClient';
import type { GameProgressType, LevelProgressType } from '$types/supabase/gameProgress';

/**
 * Get a user from auth.users by ID
 * @param {string} id - The user ID to fetch
 * @returns {Promise<any|null>} The user object or null if not found
 */
export async function getUserById(id: string) {
	const { data, error } = await supabase.auth.admin.getUserById(id);

	if (error) {
		console.error('Error fetching user by ID:', error);
		return null;
	}

	return data.user || null;
}

/**
 * Get a user from auth.users by email
 * @param {string} email - The email address to search for
 * @returns {Promise<any|null>} The user object or null if not found
 */
export async function getUserByEmail(email: string) {
	const { data, error } = await supabase.auth.admin.listUsers();

	if (error) {
		console.error('Error fetching user by email:', error);
		return null;
	}

	return data.users.find((user) => user.email === email) || null;
}

/**
 * List all users from auth.users
 * @returns {Promise<any[]>} Array of all user objects
 */
export async function listAllUsers() {
	const { data, error } = await supabase.auth.admin.listUsers();

	if (error) {
		console.error('Error listing users:', error);
		return [];
	}

	return data.users;
}

/**
 * Initialize game progress for a new user
 * @param {string} userId - The user ID to create progress for
 * @returns {Promise<any|null>} The created game progress record or null if failed
 */
export async function initializeGameProgress(userId: string) {
	const gameProgress: GameProgressType = {
		levels: {
			level1: { stars: 0, completed: false, locked: false },
			level2: { stars: 0, completed: false, locked: true },
			level3: { stars: 0, completed: false, locked: true },
			level4: { stars: 0, completed: false, locked: false },
			level5: { stars: 0, completed: false, locked: true },
			level6: { stars: 0, completed: false, locked: true },
			level7: { stars: 0, completed: false, locked: false },
			level8: { stars: 0, completed: false, locked: true },
			level9: { stars: 0, completed: false, locked: true },
			level10: { stars: 0, completed: false, locked: false },
			level11: { stars: 0, completed: false, locked: true },
			level12: { stars: 0, completed: false, locked: true }
		}
	};

	const { data, error } = await supabaseAdmin
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

	return data;
}

/**
 * Get game progress for the currently logged in user
 * @param {string} userId - The user ID to fetch progress for
 * @param {any} client - The authenticated Supabase client
 * @returns {Promise<GameProgressType|null>} The game progress object or null if not found
 */
export async function getGameProgress(
	userId: string,
	client: any = supabase
): Promise<GameProgressType | null> {
	const { data, error } = await client
		.from('game_progress')
		.select('progress, user_id')
		.eq('user_id', userId)
		.single();

	if (error) {
		console.error('Error fetching game progress:', error);
		return null;
	}

	return data?.progress as GameProgressType | null;
}

/**
 * Get game progress by record ID
 * @param {number} id - The game progress record ID
 * @returns {Promise<any|null>} The game progress record or null if not found
 */
export async function getGameProgressById(id: number) {
	const { data, error } = await supabase.from('game_progress').select('*').eq('id', id).single();

	if (error) {
		console.error('Error fetching game progress by ID:', error);
		return null;
	}

	return data;
}

/**
 * Update game progress for a user
 * @param {string} userId - The user ID to update progress for
 * @param {GameProgressType} progress - The updated game progress object
 * @param {any} client - The authenticated Supabase client
 * @returns {Promise<GameProgressType|null>} The updated progress object or null if failed
 */
export async function updateGameProgress(
	userId: string,
	progress: GameProgressType,
	client: any = supabase
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
 * @param {any} client - The authenticated Supabase client
 * @returns {Promise<GameProgressType|null>} The updated progress object or null if failed
 */
export async function updateLevelProgress(
	userId: string,
	levelNumber: number,
	attributes: LevelProgressType,
	client: any = supabase
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
 * Get attributes of a specific level
 * @param {string} userId - The user ID to fetch progress for
 * @param {number} levelNumber - The level number
 * @param {any} client - The authenticated Supabase client
 * @returns {Promise<LevelProgressType|null>} The level's attributes or null if not found
 */
export async function getLevelProgress(
	userId: string,
	levelNumber: number,
	client: any = supabase
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
