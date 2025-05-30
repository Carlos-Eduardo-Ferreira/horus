// Pega o nome da aplicação do ambiente
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Hórus';

/**
 * Gera um título de página consistente
 * 
 * @param pageTitle - Título específico da página (opcional)
 * @returns String formatada com o padrão "APP_NAME | pageTitle" ou apenas "APP_NAME"
 */
export function generateTitle(pageTitle?: string): string {
  if (!pageTitle) return APP_NAME;
  return `${APP_NAME} | ${pageTitle}`;
}
