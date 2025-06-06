'use client';

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SidebarMenu } from "@/components/SidebarMenu";
import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { NotificationToastProvider } from '@/context/notificationToast.context';
import NotificationToastContainer from '@/components/NotificationToast';

interface LayoutContextType {
  setStickyFooter: (sticky: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
};

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [stickyFooter, setStickyFooter] = useState(true); // Default to sticky

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  return (
    <NotificationToastProvider>
      <LayoutContext.Provider value={{ setStickyFooter }}>
        <div className={`flex flex-col md:flex-row ${stickyFooter ? 'h-screen' : 'min-h-screen'} overflow-hidden`}>
          <SidebarMenu />
          <div className="flex flex-1 flex-col min-w-0 min-h-0">
            <Header />
            <main className={`flex-1 bg-muted p-6 ${stickyFooter ? 'overflow-hidden' : 'overflow-visible'}`}>
              <div className={stickyFooter ? 'h-full max-h-[calc(100vh-8rem)]' : 'min-h-full'}>
                {children}
              </div>
            </main>
            <Footer className={stickyFooter ? "sticky bottom-0 w-full" : "w-full mt-auto"} />
          </div>
        </div>
      </LayoutContext.Provider>
      <NotificationToastContainer />
    </NotificationToastProvider>
  );
}