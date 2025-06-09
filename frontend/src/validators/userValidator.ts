import { DynamicFormField } from "@/components/DynamicForm";

export function validateUserForm(fields: DynamicFormField[], role?: string) {
  const errors: { [key: string]: string } = {};
  const name = fields.find(f => f.name === "name")?.value ?? "";
  const email = fields.find(f => f.name === "email")?.value ?? "";
  const document = fields.find(f => f.name === "document")?.value ?? "";
  const password = fields.find(f => f.name === "password")?.value ?? "";
  const passwordConfirmation = fields.find(f => f.name === "password_confirmation")?.value ?? "";
  const passwordField = fields.find(f => f.name === "password");
  const isEditMode = passwordField ? !passwordField.required : true;
  const normalizedRole = (role ?? "").toString().toLowerCase();
  const isCompany = normalizedRole === "company";

  if (!isCompany && !String(name).trim()) {
    errors.name = "O nome é obrigatório";
  }

  // Email agora é obrigatório para todos os tipos de usuário
  if (!String(email).trim()) {
    errors.email = "O email é obrigatório";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    errors.email = "Digite um email válido";
  }

  if (!String(document).trim()) {
    errors.document = isCompany ? "O CNPJ é obrigatório" : "O CPF é obrigatório";
  } else {
    const cleanDocument = String(document).replace(/\D/g, '');
    if (isCompany) {
      if (cleanDocument.length !== 14) {
        errors.document = "O CNPJ deve ter exatamente 14 dígitos";
      }
    } else if (isEditMode) {
      if (cleanDocument.length !== 11) {
        errors.document = "O CPF deve ter exatamente 11 dígitos";
      }
    } else {
      if (cleanDocument.length !== 11) {
        errors.document = "O CPF deve ter exatamente 11 dígitos";
      }
    }
  }

  const hasPassword = String(password).trim().length > 0;
  const hasPasswordConfirmation = String(passwordConfirmation).trim().length > 0;

  if (!isEditMode) {
    if (!hasPassword) {
      errors.password = "A senha é obrigatória";
    } else if (String(password).length < 8) {
      errors.password = "A senha deve ter pelo menos 8 caracteres";
    }

    if (!hasPasswordConfirmation) {
      errors.password_confirmation = "A confirmação de senha é obrigatória";
    } else if (String(password) !== String(passwordConfirmation)) {
      errors.password_confirmation = "As senhas não coincidem";
    }
  } else {
    if (hasPassword) {
      if (String(password).length < 8) {
        errors.password = "A nova senha deve ter pelo menos 8 caracteres";
      }

      if (!hasPasswordConfirmation) {
        errors.password_confirmation = "A confirmação da nova senha é obrigatória";
      } else if (String(password) !== String(passwordConfirmation)) {
        errors.password_confirmation = "As senhas não coincidem";
      }
    } else if (hasPasswordConfirmation) {
      errors.password = "Informe a nova senha";
    }
  }

  return errors;
}
