export function validateRegisterForm(
  form: {
    name: string;
    email: string;
    document: string;
    password: string;
    password_confirmation: string;
  },
  userType: 'consumer' | 'company'
) {
  const errors: {
    name?: string;
    email?: string;
    document?: string;
    password?: string;
    password_confirmation?: string;
  } = {};

  const cleanedDocument = form.document.replace(/\D/g, '');

  // Validações específicas para consumidor (pessoa física)
  if (userType === 'consumer') {
    if (!form.name.trim()) {
      errors.name = 'O nome é obrigatório';
    }

    if (!form.email.trim()) {
      errors.email = 'O e-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Digite um e-mail válido';
    }

    if (!cleanedDocument) {
      errors.document = 'O CPF é obrigatório';
    } else if (cleanedDocument.length !== 11) {
      errors.document = 'O CPF deve ter 11 dígitos';
    }
  } 
  // Validações para empresa (pessoa jurídica)
  else if (userType === 'company') {
    if (!cleanedDocument) {
      errors.document = 'O CNPJ é obrigatório';
    } else if (cleanedDocument.length !== 14) {
      errors.document = 'O CNPJ deve ter 14 dígitos';
    }
  }

  // Validações comuns para ambos os tipos
  if (!form.password) {
    errors.password = 'A senha é obrigatória';
  } else if (form.password.length < 8) {
    errors.password = 'A senha deve ter pelo menos 8 caracteres';
  }

  if (!form.password_confirmation) {
    errors.password_confirmation = 'A confirmação de senha é obrigatória';
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'As senhas não coincidem';
  }

  return errors;
}