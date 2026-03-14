import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { initializeGameProgress, getGameProgress } from '$lib/server/services';

export const GET: RequestHandler = async ({ url, locals: { supabase, safeGetSession } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			const { session } = await safeGetSession();

			if (session?.user?.id) {
				const gameProgress = await getGameProgress(session.user.id, supabase);

				if (!gameProgress) {
					await initializeGameProgress(session.user.id);
				}
			}

			redirect(303, '/levels');
		}
	}

	redirect(303, '/auth/error');
};
