import '~/styles/globals.css'
import { GlobalContextProvider } from '@/context/global.context'
import { APP_NAME } from '@/utils/title-utils'

export const metadata = {
  title: APP_NAME,
  description: 'Sistema de gerenciamento',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
      </body>
    </html>
  );
}
