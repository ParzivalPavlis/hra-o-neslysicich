import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.user) {
		redirect(302, '/login');
	}

	await locals.supabase.auth.signOut();
	return json({ success: true });
};
