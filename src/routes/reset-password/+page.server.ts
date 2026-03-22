import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { FormErrorsType, FormResponseType } from '$types/form';

export const load: PageServerLoad = async (event) => {
	const {
		url,
		locals: { safeGetSession }
	} = event;

	const code = url.searchParams.get('code');

	if (!code) {
		const { session } = await safeGetSession();
		if (!session?.user) {
			redirect(303, '/forgot-password');
		}
	}
};

export const actions: Actions = {
	default: async (event) => {
		const {
			locals: { supabase, safeGetSession }
		} = event;

		const { session } = await safeGetSession();

		// User must be authenticated to reset password
		if (!session?.user) {
			return fail(401, {
				success: false,
				message: 'Musíte být přihlášeni pro obnovu hesla. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		const formData = await event.request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		let errors: FormErrorsType = {};

		// Password validation
		if (!password || password.length < 6) {
			errors.password = 'Heslo musí mít alespoň 6 znaků';
		}

		// Password confirmation
		if (password !== confirmPassword) {
			errors.confirmPassword = 'Hesla se neshodují';
		}

		// Return early if validation errors
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors
			} as FormResponseType);
		}

		// Update password
		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			return fail(400, {
				success: false,
				message: 'Obnovení hesla selhalo. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		// Log out the user after password reset
		await supabase.auth.signOut();

		return {
			success: true,
			message: 'Heslo bylo úspěšně změněno. Přihlašte se prosím s vašim novým heslem.'
		} as FormResponseType;
	}
};
