interface RegisterForm {
  name: string;
  legal_name?: string;
  email: string;
  document: string;
  password: string;
  password_confirmation: string;
}

export function validateRegisterForm(form: RegisterForm, userType: 'consumer' | 'company') {
  const errors: { [key: string]: string } = {};

  // Validação do nome
  if (userType === 'consumer') {
    if (!form.name.trim()) {
      errors.name = "O nome é obrigatório";
    }
  }
  // Para empresa, nome e legal_name são preenchidos automaticamente via API

  // Validação do email (obrigatório para ambos os tipos)
  if (!form.email.trim()) {
    errors.email = "O e-mail é obrigatório";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Digite um email válido";
  }

  // Validação do documento
  if (!form.document.trim()) {
    errors.document = userType === 'consumer' ? "O CPF é obrigatório" : "O CNPJ é obrigatório";
  } else {
    const cleanDocument = form.document.replace(/\D/g, '');
    if (userType === 'consumer') {
      if (cleanDocument.length !== 11) {
        errors.document = "O CPF deve ter exatamente 11 dígitos";
      }
    } else {
      if (cleanDocument.length !== 14) {
        errors.document = "O CNPJ deve ter exatamente 14 dígitos";
      }
    }
  }

  // Validação da senha
  if (!form.password.trim()) {
    errors.password = "A senha é obrigatória";
  } else if (form.password.length < 8) {
    errors.password = "A senha deve ter pelo menos 8 caracteres";
  }

  // Validação da confirmação de senha
  if (!form.password_confirmation.trim()) {
    errors.password_confirmation = "A confirmação de senha é obrigatória";
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = "As senhas não coincidem";
  }

  return errors;
}