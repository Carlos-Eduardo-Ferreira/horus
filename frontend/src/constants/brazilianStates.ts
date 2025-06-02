export const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" }
];

export type BrazilianStateCode = typeof BRAZILIAN_STATES[number]['value'];

export function findStateByAbbreviation(uf: string): typeof BRAZILIAN_STATES[number] | undefined {
  return BRAZILIAN_STATES.find(state => state.value === uf.toUpperCase());
}

export function findStateOptionByViaCepUF(
  uf: string, 
  stateOptions: { value: string; label: string }[]
): { value: string; label: string } | undefined {
  const brazilianState = findStateByAbbreviation(uf);
  
  if (!brazilianState) {
    return undefined;
  }
  
  return stateOptions.find(option => {
    const optionLabel = option.label.toUpperCase();
    const stateName = brazilianState.label.toUpperCase();
    
    return optionLabel === stateName || optionLabel.includes(stateName);
  });
}
