import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { FormErrorsType, FormResponseType } from '$types/form';
import { initializeGameProgress } from '$lib/server/services';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session || locals.user) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	// Email and password registration
	email: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;

		// Extract registration form data
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		const errors: FormErrorsType = {};

		// Validate email format
		const validEmail = /^[\w\-.+]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
		if (!validEmail) {
			errors.email = 'Prosím zadejte platnou e-mailovou adresu';
		}

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
				errors,
				email
			} as FormResponseType);
		}

		// Register user with Supabase
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${event.url.origin}/auth/confirm`
			}
		});

		// Handle registration errors
		if (error) {
			let message = 'Registrace selhala. Prosím zkuste znovu.';
			// Check if user already exists
			if (
				error.message?.toLowerCase().includes('already registered') ||
				error.message?.toLowerCase().includes('already exists') ||
				error.code === 'user_already_exists'
			) {
				message = 'Účet s tímto e-mailem již existuje.';
			}
			return fail(400, {
				success: false,
				email,
				message
			} as FormResponseType);
		}

		// Set up initial game progress for the new user
		if (data.user?.id) {
			await initializeGameProgress(data.user.id);
		}

		return {
			success: true,
			message:
				'Účet vytvořen! Prosím zkontrolujte svůj e-mail pro ověření účtu, nebo se můžete přihlásit hned.'
		} as FormResponseType;
	},
	// Google OAuth registration
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

		// Return error if OAuth initialization failed
		if (error) {
			return fail(400, {
				success: false,
				message: 'Registrace přes Google selhala. Prosím zkuste znovu.'
			} as FormResponseType);
		}

		// Redirect to Google login URL
		if (data.url) {
			redirect(303, data.url);
		}
	}
};
