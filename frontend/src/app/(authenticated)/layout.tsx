import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SidebarMenu } from "@/components/SidebarMenu";

// Componente de layout utilizado após autenticação do usuário
// Recebe os elementos filhos como prop (children)
export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Estrutura principal com menu lateral, cabeçalho, conteúdo e rodapé
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <SidebarMenu />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted p-6">
          <div className="h-full max-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
        <Footer className="sticky bottom-0 w-full" />
      </div>
    </div>
  );
}