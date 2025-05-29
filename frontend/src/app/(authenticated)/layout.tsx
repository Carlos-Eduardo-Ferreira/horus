'use client';

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SidebarMenu } from "@/components/SidebarMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <SidebarMenu />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden bg-muted p-6">
          <div className="h-full max-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
        <Footer className="sticky bottom-0 w-full" />
      </div>
    </div>
  );
}