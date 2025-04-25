import '../../../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Título',
  description: 'Descrição',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-[url('/assets/background_auth.png')] bg-cover bg-center flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="auth-form-wrapper">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}