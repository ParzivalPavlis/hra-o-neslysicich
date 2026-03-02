import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getGameProgress } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();

	// Redirect to login if not authenticated
	if (!session) {
		redirect(303, '/login');
	}

	// Fetch the user's game progress using the authenticated supabase client
	const gameProgress = await getGameProgress(session.user.id, supabase);

	return {
		gameProgress
	};
};
