import type { Metadata } from "next";
import "~/styles/globals.css";
import { AuthProvider } from "@/context/auth.context";
import { GlobalContextProvider } from "@/context/global.context";
import { APP_NAME } from '@/utils/title-utils'

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Sistema de gerenciamento',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <GlobalContextProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
