import type { PageServerLoad, Actions } from './$types';
import { updateLevelProgress, getLevelProgress } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	return {
		userId: session?.user.id
	};
};

export const actions: Actions = {
	saveLevelProgress: async (event) => {
		const {
			locals: { safeGetSession, supabase }
		} = event;
		const { session } = await safeGetSession();

		if (!session) {
			return { success: false };
		}

		const formData = await event.request.formData();
		const newStars = parseInt(formData.get('stars') as string) as 0 | 1 | 2 | 3;

		// Get current level progress
		const currentProgress = await getLevelProgress(session.user.id, 1, supabase);

		// Only update if user got more stars than before
		if (currentProgress && currentProgress.stars >= newStars) {
			return { success: true };
		}

		const result = await updateLevelProgress(
			session.user.id,
			1,
			{
				stars: newStars,
				completed: true,
				locked: false
			},
			supabase
		);

		if (!result) {
			return { success: false, error: 'Failed to save progress' };
		}

		return { success: true, message: 'Progress updated!' };
	}
};
