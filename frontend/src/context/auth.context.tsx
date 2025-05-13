"use client";

import { api } from "@/api/api";
import Loading from "@/app/loading";
import { STORAGE_KEYS, getItem } from "@/helpers/storage.helper";
import { ReactNode, createContext, useEffect, useState } from "react";

interface IAuthProviderProps {
  children: ReactNode;
}

interface IAuthContext {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const token = getItem(STORAGE_KEYS.token);

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };