import { DynamicFormField } from "@/components/DynamicForm";

export function validateUserForm(fields: DynamicFormField[]) {
  const errors: { [key: string]: string } = {};
  
  // Busca os campos pelo nome
  const name = fields.find(f => f.name === "name")?.value || "";
  const email = fields.find(f => f.name === "email")?.value || "";
  const document = fields.find(f => f.name === "document")?.value || "";
  const password = fields.find(f => f.name === "password")?.value || "";
  const passwordConfirmation = fields.find(f => f.name === "password_confirmation")?.value || "";
  
  // Verifica se é modo de edição baseado no required do campo password
  const passwordField = fields.find(f => f.name === "password");
  const isEditMode = !passwordField?.required;

  // Validações específicas para cada campo
  if (!String(name).trim()) {
    errors.name = "O nome é obrigatório";
  }
  
  if (String(email).trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    errors.email = "Digite um email válido";
  }
  
  if (!String(document).trim()) {
    errors.document = "O CPF é obrigatório";
  } else {
    // Validar se tem 11 dígitos (CPF)
    const cleanDocument = String(document).replace(/\D/g, '');
    if (cleanDocument.length !== 11) {
      errors.document = "O CPF deve ter exatamente 11 dígitos";
    }
  }
  
  // Lógica de validação de senha
  const hasPassword = String(password).trim().length > 0;
  const hasPasswordConfirmation = String(passwordConfirmation).trim().length > 0;
  
  if (!isEditMode) {
    // Modo de inserção: senha sempre obrigatória
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
    // Modo de edição: senha opcional, mas se informada deve ser válida
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
