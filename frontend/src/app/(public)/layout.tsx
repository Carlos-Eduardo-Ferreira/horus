import '~/styles/globals.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[url('/assets/background_auth.png')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-muted p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}