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
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMenuOpen(!isMobile);
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  const contextValue = {
    isMenuOpen: isMounted ? isMenuOpen : true,
    toggleMenu,
    closeMenu,
    openMenu,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };