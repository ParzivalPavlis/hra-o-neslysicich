import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { FormErrorsType, FormResponseType } from '$types/form';

export const load: PageServerLoad = async ({ locals, url }) => {
	const code = url.searchParams.get('code');

	// Redirect authenticated users to home
	if (!locals.session || !locals.user) {
		// If no code provided and not authenticated, redirect to forgot-password
		if (!code) {
			redirect(303, '/forgot-password');
		}
	} else {
		redirect(303, '/');
	}

	return { code };
};

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event;
		const { supabase } = locals;

		// Extract recovery code and new password from form
		const formData = await event.request.formData();
		const code = formData.get('code') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		const errors: FormErrorsType = {};

		// Validate password length (minimum 8 characters)
		if (!password || password.length < 8) {
			errors.password = 'Heslo musí mít alespoň 8 znaků';
		}

		// Verify passwords match
		if (password !== confirmPassword) {
			errors.confirmPassword = 'Hesla se neshodují';
		}

		// Return validation errors if any exist
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors
			} as FormResponseType);
		}

		// Exchange recovery code for an authenticated session
		const { data: sessionData, error: sessionError } =
			await supabase.auth.exchangeCodeForSession(code);

		// Return error if code exchange failed
		if (sessionError || !sessionData.session) {
			return fail(400, {
				success: false,
				message: 'Obnovení hesla selhalo. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		// Update user password in Supabase
		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			return fail(400, {
				success: false,
				message: 'Aktualizace hesla selhala. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		// Sign out user after successful password reset
		await supabase.auth.signOut();

		return {
			success: true,
			message: 'Heslo bylo úspěšně změněno. Přihlašte se prosím s vašim novým heslem.'
		} as FormResponseType;
	}
};
