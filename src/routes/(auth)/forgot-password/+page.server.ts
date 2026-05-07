import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { FormErrorsType, FormResponseType } from '$types/form';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session || locals.user) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const {
			request,
			locals: { supabase },
			url
		} = event;

		// Extract email from form submission
		const formData = await request.formData();
		const email = formData.get('email') as string;

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

		// Send password reset email with redirect link
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/reset-password`
		});

		// Don't reveal whether the email exists for security reasons
		if (error) {
			return fail(400, {
				success: false,
				email,
				message: 'Pokud existuje účet s touto e-mailovou adresou, obdržíte odkaz na obnovu hesla.'
			} as FormResponseType);
		}

		return {
			success: true,
			message: 'Pokud existuje účet s touto e-mailovou adresou, obdržíte odkaz na obnovu hesla.'
		} as FormResponseType;
	}
};
