export interface CnpjResponse {
  nome: string;
  fantasia?: string;
  cnpj: string;
}

export const cnpjService = {
  async fetchCompany(cnpj: string): Promise<CnpjResponse | null> {
    const cleanCnpj = cnpj.replace(/\D/g, '');

    if (cleanCnpj.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }

    // Tenta usar proxy backend para evitar CORS
    try {
      const response = await fetch(`/api/cnpj/${cleanCnpj}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CNPJ não encontrado');
        }
        throw new Error('Erro no servidor de consulta de CNPJ');
      }

      const data = await response.json();

      if (data.status === "ERROR") {
        throw new Error(data.message || 'CNPJ não encontrado');
      }

      return {
        nome: data.nome,
        fantasia: data.fantasia,
        cnpj: data.cnpj,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  }
};
