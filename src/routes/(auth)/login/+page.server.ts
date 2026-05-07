import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { FormErrorsType, FormResponseType } from '$types/form';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session || locals.user) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	// Email and password login
	email: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;

		// Extract email and password from form submission
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const errors: FormErrorsType = {};

		// Validate email format
		const validEmail = /^[\w\-.+]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
		if (!validEmail) {
			errors.email = 'Prosím zadejte platnou e-mailovou adresu';
		}

		// Return validation errors if any exist
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				email
			} as FormResponseType);
		}

		// Authenticate user with Supabase
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		// Return error if authentication failed
		if (error) {
			return fail(401, {
				success: false,
				email,
				message: 'Neplatný e-mail nebo heslo'
			} as FormResponseType);
		}

		// Redirect to levels on successful login
		redirect(303, '/levels');
	},
	// Google OAuth login
	google: async (event) => {
		const {
			locals: { supabase },
			url
		} = event;

		// Initiate Google OAuth flow
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/api/v1/auth/callback`
			}
		});

		console.log('Google Sign-In data:', data);

		// Return error if OAuth initialization failed
		if (error) {
			return fail(400, {
				success: false,
				message: 'Přihlášení přes Google selhalo. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		// Redirect to Google login URL
		if (data.url) {
			redirect(303, data.url);
		}
	}
};
