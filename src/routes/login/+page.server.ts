import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { FormErrorsType, FormResponseType } from '$types/form';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (session) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	email: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

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

		// Return early if validation errors
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				email
			} as FormResponseType);
		}

		// Sign In logic
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return fail(401, {
				success: false,
				email,
				message: 'Neplatný e-mail nebo heslo'
			} as FormResponseType);
		}

		redirect(303, '/levels');
	},
	google: async (event) => {
		const {
			locals: { supabase },
			url
		} = event;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/api/v1/auth/callback`
			}
		});

		console.log('Google Sign-In data:', data);

		if (error) {
			return fail(400, {
				success: false,
				message: 'Přihlášení přes Google selhalo. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		if (data.url) {
			redirect(303, data.url);
		}
	}
};
