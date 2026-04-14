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

		const formData = await request.formData();
		const email = formData.get('email') as string;

		const errors: FormErrorsType = {};

		// Email validation
		const validEmail = /^[\w\-.+]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
		if (!validEmail) {
			errors.email = 'Prosím zadejte platnou e-mailovou adresu';
		}

		// Return early if validation errors
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				email
			} as FormResponseType);
		}

		// Send password reset email
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/reset-password`
		});

		if (error) {
			// Don't reveal whether the email exists for security reasons
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
