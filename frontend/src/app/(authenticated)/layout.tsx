import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SidebarMenu } from "@/components/SidebarMenu";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen md:overflow-hidden">
      <SidebarMenu />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="min-h-full p-4">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
