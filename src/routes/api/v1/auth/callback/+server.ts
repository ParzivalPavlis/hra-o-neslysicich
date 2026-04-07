import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { safeGetSession } from '$lib/server/services';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const { supabase } = locals;

	if (!code) {
		redirect(303, '/auth/error');
	}

	const { error } = await supabase.auth.exchangeCodeForSession(code);
	if (error) {
		console.error('Error exchanging code for session:', error);
		redirect(303, '/auth/error');
	}

	const { session, user } = await safeGetSession(supabase);
	if (!session || !user?.id) {
		console.error('No user found in session after authentication');
		redirect(303, '/auth/error');
	}

	redirect(303, '/levels');
};
