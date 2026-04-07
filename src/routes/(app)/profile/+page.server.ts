import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLevelProgress } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user, supabase } = locals;

	if (!session || !user) {
		redirect(303, '/login');
	}

	// Load progress for all 8 levels
	const levelProgressPromises = Array.from({ length: 8 }, (_, i) =>
		getLevelProgress(user.id, i + 1, supabase)
	);

	const levelProgress = await Promise.all(levelProgressPromises);

	// Calculate total stars
	const totalStars = levelProgress.reduce((sum, progress) => sum + (progress?.stars || 0), 0);

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
		maxStars: 24
	};
};
