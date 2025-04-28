import '~/styles/globals.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[url('/assets/background_auth.png')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="auth-form-wrapper">
          {children}
        </div>
      </div>
    </div>
  )
}
