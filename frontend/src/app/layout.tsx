import '~/styles/globals.css'
import { GlobalContextProvider } from '@/context/global.context'

// Define metadados do layout raiz, que serão utilizados no <head> da página HTML
export const metadata = {
  title: 'Título', // Título da página
  description: 'Descrição', // Descrição da aplicação
  viewport: 'width=device-width, initial-scale=1.0', // Configuração para responsividade
};

// Componente RootLayout é o layout principal da aplicação
// Recebe os elementos filhos como prop (children)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Define o idioma padrão do documento como português do Brasil
    <html lang="pt-BR">
      <body>
        {/*  Envolve toda a aplicação com o GlobalContextProvider. Isso permite que qualquer componente dentro da árvore acesse o contexto global */}
        <GlobalContextProvider>
          {children} {/* Renderiza os componentes filhos dentro do layout */}
        </GlobalContextProvider>
      </body>
    </html>
  );
}