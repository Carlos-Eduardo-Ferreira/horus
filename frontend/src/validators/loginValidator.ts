export function validateLoginForm(document: string, password: string) {
	const cleanedDocument = document.replace(/\D/g, '');
	const errors: { document?: string; password?: string } = {};

	if (!cleanedDocument) {
		errors.document = 'O CPF/CNPJ é obrigatório';
	} else if (cleanedDocument.length !== 11 && cleanedDocument.length !== 14) {
		errors.document = 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)';
	}

	if (!password) {
		errors.password = 'A senha é obrigatória';
	} else if (password.length < 8) {
		errors.password = 'A senha deve ter pelo menos 8 caracteres';
	}

	return errors;
}