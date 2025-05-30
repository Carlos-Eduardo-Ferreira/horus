import { useEffect } from 'react';
import { generateTitle } from '@/utils/title-utils';

/**
 * Hook para definir título de página em componentes client-side
 * 
 * @param pageTitle - Título específico da página
 */
export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    // Define o título do documento
    document.title = generateTitle(pageTitle);
    
    // Restaura o título original quando o componente é desmontado
    return () => {
      document.title = generateTitle();
    };
  }, [pageTitle]);
}
