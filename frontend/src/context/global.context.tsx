"use client";

import { createContext, ReactNode, useState, useEffect } from "react";

interface IGlobalContextProps {
  children: ReactNode;
}

interface IGlobalContextProviderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}

const GlobalContext = createContext<IGlobalContextProviderProps>(
  {} as IGlobalContextProviderProps
);

const GlobalContextProvider = ({ children }: IGlobalContextProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  
  useEffect(() => {
    // Verifica se é um dispositivo móvel no carregamento inicial
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 768; // breakpoint md do Tailwind
      setIsMenuOpen(!isMobile); // menu aberto no desktop, fechado no mobile
    };
    
    // Verifica no carregamento da página
    checkIfMobile();
    
    // Adiciona listener para redimensionamento da janela
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  return (
    <GlobalContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu, openMenu }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };