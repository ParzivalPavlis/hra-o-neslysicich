export interface FormErrorsType {
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export interface FormResponseType {
	errors?: FormErrorsType;
	email?: string;
	success?: boolean;
	message?: string;
}
