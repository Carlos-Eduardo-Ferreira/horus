import { DynamicFormField } from "@/components/DynamicForm";

export function validateLocalUnitForm(fields: DynamicFormField[]) {
  const errors: { [key: string]: string } = {};
  
  const name = fields.find(f => f.name === "name")?.value || "";
  const identifier = fields.find(f => f.name === "identifier")?.value || "";
  const email = fields.find(f => f.name === "email")?.value || "";
  const street = fields.find(f => f.name === "street")?.value || "";
  const number = fields.find(f => f.name === "number")?.value || "";
  const neighborhood = fields.find(f => f.name === "neighborhood")?.value || "";
  const city = fields.find(f => f.name === "city")?.value || "";
  const stateId = fields.find(f => f.name === "state_id")?.value || "";
  const zipCode = fields.find(f => f.name === "zip_code")?.value || "";
  const phone = fields.find(f => f.name === "phone")?.value || "";

  if (!String(name).trim()) {
    errors.name = "O nome é obrigatório";
  }
  
  if (!String(identifier).trim()) {
    errors.identifier = "O identificador é obrigatório";
  }

  if (!String(email).trim()) {
    errors.email = "O email é obrigatório";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      errors.email = "O email deve ter um formato válido";
    }
  }
  
  if (!String(street).trim()) {
    errors.street = "A rua é obrigatória";
  }
  
  if (!String(number).trim()) {
    errors.number = "O número é obrigatório";
  }
  
  if (!String(neighborhood).trim()) {
    errors.neighborhood = "O bairro é obrigatório";
  }
  
  if (!String(city).trim()) {
    errors.city = "A cidade é obrigatória";
  }
  
  if (!String(stateId).trim()) {
    errors.state_id = "O estado é obrigatório";
  } else if (isNaN(Number(stateId))) {
    errors.state_id = "O estado selecionado é inválido";
  }
  
  if (!String(zipCode).trim()) {
    errors.zip_code = "O CEP é obrigatório";
  } else if (String(zipCode).replace(/\D/g, '').length !== 8) {
    errors.zip_code = "O CEP deve ter 8 dígitos";
  }

  if (!String(phone).trim()) {
    errors.phone = "O telefone é obrigatório";
  } else {
    const cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errors.phone = "O telefone deve ter 10 dígitos";
    }
  }
  
  return errors;
}
