import type { Actions } from './$types';
import { updateLevelProgress, getLevelProgress, unlockNextLevel } from '$lib/server/services';
import type { FormSaveLevelProgressResponseType } from '$types/form';

export const actions: Actions = {
	saveLevelProgress: async (event): Promise<FormSaveLevelProgressResponseType> => {
		const { locals } = event;
		const { session, user, supabase } = locals;

		if (!session || !user) {
			return { success: false };
		}

		const formData = await event.request.formData();
		const newStars = parseInt(formData.get('stars') as string) as 0 | 1 | 2 | 3;

		// Get current level progress
		const currentProgress = await getLevelProgress(user.id, 1, supabase);

		// Check if this is first time getting 3 stars
		const firstTimeThreeStars = newStars === 3 && (!currentProgress || currentProgress.stars < 3);

		// Only update if user got more stars than before
		if (currentProgress && currentProgress.stars >= newStars) {
			return { success: true };
		}

		const result = await updateLevelProgress(
			user.id,
			1,
			{
				stars: newStars,
				completed: true,
				locked: false
			},
			event.locals.supabase
		);

		if (!result) {
			return {
				success: false,
				error: 'Failed to save progress'
			};
		}

		const wasUnlocked = newStars >= 1 && (await unlockNextLevel(user.id, 1, supabase));

		return {
			success: true,
			message: 'Progress updated!',
			firstTimeThreeStars,
			unlockedLevel: wasUnlocked ? 2 : undefined
		};
	}
};
