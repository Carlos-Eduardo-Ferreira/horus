import type { Metadata, Viewport } from "next";
import "~/styles/globals.css";
import { AuthProvider } from "@/context/auth.context";
import { GlobalContextProvider } from "@/context/global.context";
import { LocalUnitProvider } from "@/context/localUnit.context";
import { APP_NAME } from '@/utils/title-utils'

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Sistema de gerenciamento',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
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
            <LocalUnitProvider>
              {children}
            </LocalUnitProvider>
          </AuthProvider>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
