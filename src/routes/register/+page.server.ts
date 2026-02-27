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
			errors.email = 'Please enter a valid email address';
		}

		// Password validation
		if (!password || password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		}

		// Password confirmation
		if (password !== confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
		}

		// Return early if validation errors
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				email
			} as FormResponseType);
		}

		// Sign Up logic
		const { error } = await supabase.auth.signUp({
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
				message: error.message || 'Failed to sign up. Please try again.'
			} as FormResponseType);
		}

		return {
			success: true,
			message:
				'Account created! Please check your email to verify your account, or you can sign in now.'
		} as FormResponseType;
	}
};
