"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface LocalUnitContextProps {
  identifier: string | null;
}

const LocalUnitContext = createContext<LocalUnitContextProps>({ identifier: null });

export function extractLocalUnitIdentifier(hostname: string): string | null {
  const parts = hostname.split(".");
  if (parts.length < 2) return null;
  if (parts[0] === "www") return parts[1];
  return parts[0];
}

export const LocalUnitProvider = ({ children }: { children: ReactNode }) => {
  const [identifier, setIdentifier] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      setIdentifier(extractLocalUnitIdentifier(host));
    }
  }, []);

  return (
    <LocalUnitContext.Provider value={{ identifier }}>
      {children}
    </LocalUnitContext.Provider>
  );
};

export function useLocalUnit() {
  return useContext(LocalUnitContext);
}
