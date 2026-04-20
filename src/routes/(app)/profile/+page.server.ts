import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLevelProgress } from '$lib/server/services';
import { levels } from '$lib/levels';

const STARS_PER_LEVEL = 3;

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user, supabase } = locals;

	if (!session || !user) {
		redirect(303, '/login');
	}

	// Load progress dynamically based on available levels
	const levelProgressPromises = Array.from({ length: levels.length }, (_, i) =>
		getLevelProgress(user.id, i + 1, supabase)
	);

	const levelProgress = await Promise.all(levelProgressPromises);

	// Calculate total stars
	const totalStars = levelProgress.reduce((sum, progress) => sum + (progress?.stars || 0), 0);
	const maxStars = levels.length * STARS_PER_LEVEL;

	return {
		user: {
			email: user.email,
			id: user.id,
			createdAt: user.created_at
		},
		levelProgress: levelProgress.map((progress, index) => ({
			level: index + 1,
			stars: progress?.stars || 0,
			locked: progress?.locked !== false
		})),
		totalStars,
		maxStars
	};
};
