"use client";

import { createContext, ReactNode, useState } from "react";

interface IGlobalContextProps {
  children: ReactNode;
}

interface IGlobalContextProviderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const GlobalContext = createContext<IGlobalContextProviderProps>(
  {} as IGlobalContextProviderProps
);

const GlobalContextProvider = ({ children }: IGlobalContextProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <GlobalContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };