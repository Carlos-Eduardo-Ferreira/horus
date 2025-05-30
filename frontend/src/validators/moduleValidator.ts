import { DynamicFormField } from "@/components/DynamicForm";

export function validateModuleForm(fields: DynamicFormField[]) {
  const errors: { [key: string]: string } = {};
  
  // Busca os campos pelo nome
  const name = fields.find(f => f.name === "name")?.value || "";
  const identifier = fields.find(f => f.name === "identifier")?.value || "";

  // Validações específicas para cada campo
  if (!String(name).trim()) {
    errors.name = "O nome é obrigatório";
  }
  
  if (!String(identifier).trim()) {
    errors.identifier = "O identificador é obrigatório";
  }
  
  return errors;
}
