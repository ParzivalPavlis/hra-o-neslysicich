import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getGameProgress } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }, depends }) => {
	// Mark this load function as dependent on game:progress
	// SvelteKit will cache the result and only rerun when invalidate('game:progress') is called
	depends('game:progress');

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
