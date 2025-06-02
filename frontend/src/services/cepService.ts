export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const cepService = {
  async fetchAddress(cep: string): Promise<CepResponse | null> {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CEP não encontrado');
        }
        throw new Error('Erro no servidor de consulta de CEP');
      }

      const data: CepResponse = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      if (!data.logradouro && !data.bairro && !data.localidade) {
        throw new Error('CEP encontrado, mas sem dados de endereço');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  }
};
