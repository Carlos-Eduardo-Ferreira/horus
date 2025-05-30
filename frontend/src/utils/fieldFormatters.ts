export type FormatterType = 
  'uppercase' | 
  'identifier' | 
  'cpf' | 
  'cnpj' | 
  'cpfcnpj' | 
  'cep' | 
  'phone';

export const fieldFormatters = {
  uppercase: (value: string | number): string => {
    return String(value).toUpperCase();
  },

  identifier: (value: string | number): string => {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z_]/g, '');
  },

  // CPF: 123.456.789-00
  cpf: (value: string | number): string => {
    const cleaned = String(value).replace(/\D/g, '').slice(0, 11);
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  },

  // CNPJ: 12.345.678/0001-90
  cnpj: (value: string | number): string => {
    const cleaned = String(value).replace(/\D/g, '').slice(0, 14);
    return cleaned
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  },

  // CPF ou CNPJ (auto)
  cpfcnpj: (value: string | number): string => {
    const cleaned = String(value).replace(/\D/g, '');
    return cleaned.length <= 11
      ? fieldFormatters.cpf(cleaned)
      : fieldFormatters.cnpj(cleaned);
  },

  // CEP: 12345-678
  cep: (value: string | number): string => {
    return String(value)
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  },

  // Telefone: (12) 3456-7890
  phone: (value: string | number): string => {
    return String(value)
      .replace(/\D/g, '')
      .slice(0, 10)
      .replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  }
};

// Aplica o formatador ou retorna como string padrão
export function formatField(formatterName: FormatterType, value: string | number): string {
  const formatter = fieldFormatters[formatterName];
  return formatter ? formatter(value) : String(value);
}
