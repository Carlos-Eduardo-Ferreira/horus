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
      <SidebarMenu /> {/* Menu lateral de navegação */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header /> {/* Cabeçalho da aplicação */}
        <main className="flex-1 overflow-auto bg-muted">
          {children} {/* Renderiza os componentes filhos */}
        </main>
        <Footer className="sticky bottom-0 w-full" /> {/* Rodapé fixo ao final da página */}
      </div>
    </div>
  );
}