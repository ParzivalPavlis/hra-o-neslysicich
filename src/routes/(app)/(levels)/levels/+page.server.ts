import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getGameProgress, getLastPlayedLevel } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user, supabase } = locals;

	if (!session || !user) {
		redirect(303, '/login');
	}

	const gameProgress = await getGameProgress(user.id, supabase);
	const lastPlayedLevel = await getLastPlayedLevel(user.id, supabase);

	return {
		gameProgress,
		lastPlayedLevel
	};
};
