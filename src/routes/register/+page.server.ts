import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { FormErrorsType, FormResponseType } from '$types/form';
import { initializeGameProgress } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (session) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		let errors: FormErrorsType = {};

		// Email validation
		const validEmail = /^[\w\-.+]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
		if (!validEmail) {
			errors.email = 'Prosím zadejte platnou e-mailovou adresu';
		}

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
				errors,
				email
			} as FormResponseType);
		}

		// Sign Up logic
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${event.url.origin}/auth/confirm`
			}
		});

		if (error) {
			return fail(400, {
				success: false,
				email,
				message: error.message || 'Registrace selhala. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		// Initialize game progress for the new user
		if (data.user?.id) {
			await initializeGameProgress(data.user.id);
		}

		return {
			success: true,
			message:
				'Účet vytvořen! Prosím zkontrolujte svůj e-mail pro ověření účtu, nebo se můžete přihlásit hned.'
		} as FormResponseType;
	}
};
