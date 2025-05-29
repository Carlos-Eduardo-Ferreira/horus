// Define os tipos possíveis de formatadores
export type FormatterType = 'uppercase' | 'identifier' | 'cpf' | 'cnpj' | 'cpfcnpj';

// Objeto que contém funções de formatação para diferentes tipos
export const fieldFormatters = {
  // Formata o valor como string em letras maiúsculas
  uppercase: (value: string | number): string => {
    return String(value).toUpperCase();
  },

  // Formata o valor como um identificador: tudo em minúsculas e removendo caracteres que não sejam letras ou sublinhado
  identifier: (value: string | number): string => {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z_]/g, '');
  },

  // Formata um valor como CPF
  cpf: (value: string | number): string => {
    let cleaned = String(value).replace(/\D/g, '');
    
    cleaned = cleaned.slice(0, 11);
    
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  },

  // Formata um valor como CNPJ
  cnpj: (value: string | number): string => {
    let cleaned = String(value).replace(/\D/g, '');
    
    cleaned = cleaned.slice(0, 14);
    
    return cleaned
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  },

  // Formata automaticamente como CPF ou CNPJ dependendo do número de dígitos
  cpfcnpj: (value: string | number): string => {
    const cleaned = String(value).replace(/\D/g, '');
    
    if (cleaned.length <= 11) {
      return fieldFormatters.cpf(cleaned);
    } else {
      return fieldFormatters.cnpj(cleaned);
    }
  }
};

/**
 * Aplica um formatador ao valor fornecido com base no nome do formatador.
 * Se o nome não corresponder a um formatador válido, retorna o valor como string sem formatação.
 *
 * @param formatterName - Nome do formatador a ser aplicado ('uppercase' ou 'identifier')
 * @param value - Valor a ser formatado (string ou número)
 * @returns Valor formatado como string
 */
export function formatField(formatterName: FormatterType, value: string | number): string {
  const formatter = fieldFormatters[formatterName];
  return formatter ? formatter(value) : String(value);
}
