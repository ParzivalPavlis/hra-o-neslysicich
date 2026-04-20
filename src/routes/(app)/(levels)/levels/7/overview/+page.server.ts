import type { Actions } from './$types';
import { updateLevelProgress, getLevelProgress } from '$lib/server/services';
import type { FormSaveLevelProgressResponseType } from '$types/form';

const CURRENT_LEVEL_NUMBER = 7;

export const actions: Actions = {
	saveLevelProgress: async (event): Promise<FormSaveLevelProgressResponseType> => {
		const { locals } = event;
		const { session, user, supabase } = locals;

		if (!session || !user) {
			return { success: false };
		}

		const formData = await event.request.formData();
		const newStars = parseInt(formData.get('stars') as string) as 0 | 1 | 2 | 3;

		const currentProgress = await getLevelProgress(user.id, CURRENT_LEVEL_NUMBER, supabase);

		const firstTimeThreeStars = newStars === 3 && (!currentProgress || currentProgress.stars < 3);

		if (currentProgress && currentProgress.stars >= newStars) {
			return { success: true };
		}

		const result = await updateLevelProgress(
			user.id,
			CURRENT_LEVEL_NUMBER,
			{ stars: newStars, locked: false },
			supabase
		);

		if (!result) {
			return { success: false, error: 'Failed to save progress' };
		}

		return { success: true, message: 'Progress updated!', firstTimeThreeStars };
	}
};
