export type DisplayFormatterType = 
  'phone' | 
  'cep' | 
  'cpf' | 
  'cnpj' | 
  'cpfcnpj';

export const displayFormatters = {
  phone: (value: string | number | null | undefined): string => {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length !== 10) return String(value);
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  },

  cep: (value: string | number | null | undefined): string => {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length !== 8) return String(value);
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  },

  cpf: (value: string | number | null | undefined): string => {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length !== 11) return String(value);
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  cnpj: (value: string | number | null | undefined): string => {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length !== 14) return String(value);
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  },

  cpfcnpj: (value: string | number | null | undefined): string => {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length === 11) return displayFormatters.cpf(cleaned);
    if (cleaned.length === 14) return displayFormatters.cnpj(cleaned);
    return String(value);
  }
};

export function formatForDisplay(
  formatterName: DisplayFormatterType,
  value: string | number | null | undefined
): string {
  const formatter = displayFormatters[formatterName];
  return formatter ? formatter(value) : String(value ?? '');
}
