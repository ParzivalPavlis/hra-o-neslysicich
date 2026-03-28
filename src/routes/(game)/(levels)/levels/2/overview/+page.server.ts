import type { PageServerLoad, Actions } from './$types';
import { updateLevelProgress, getLevelProgress, unlockNextLevel } from '$lib/server/services';

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
		const currentProgress = await getLevelProgress(session.user.id, 2, supabase);

		// Check if this is first time getting 3 stars
		const firstTimeThreeStars = newStars === 3 && (!currentProgress || currentProgress.stars < 3);

		// Only update if user got more stars than before
		if (currentProgress && currentProgress.stars >= newStars) {
			return { success: true };
		}

		const result = await updateLevelProgress(
			session.user.id,
			2,
			{
				stars: newStars,
				completed: true,
				locked: false
			},
			supabase
		);

		if (!result) {
			return {
				success: false,
				error: 'Failed to save progress'
			};
		}

		const wasUnlocked = newStars >= 1 && (await unlockNextLevel(session.user.id, 2, supabase));

		return {
			success: true,
			message: 'Progress updated!',
			firstTimeThreeStars,
			unlockedLevel: wasUnlocked ? 3 : undefined
		};
	}
};
