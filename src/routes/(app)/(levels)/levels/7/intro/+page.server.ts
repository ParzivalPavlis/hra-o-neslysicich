import { setLastPlayedLevel, setPlayedLevel } from '$lib/server/services';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const CURRENT_LEVEL_NUMBER = 7;

export const load: PageServerLoad = async ({ locals }) => {
	const { user, supabase } = locals;

	if (!user) {
		redirect(303, '/login');
	}

	const setPlayed = await setPlayedLevel(user.id, CURRENT_LEVEL_NUMBER, supabase);
	await setLastPlayedLevel(user.id, CURRENT_LEVEL_NUMBER, supabase);

	return { alreadyPlayed: setPlayed === 'already-played' };
};
