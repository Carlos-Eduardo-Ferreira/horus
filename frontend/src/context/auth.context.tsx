"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthState, UserRole } from "@/types/auth";
import { usePathname } from "next/navigation";
import { route } from "@/config/namedRoutes";
import LoadingSpinner from "@/components/LoadingSpinner";

interface IAuthProviderProps {
  children: ReactNode;
}

interface IAuthContext extends AuthState {
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  checkRouteAuthorization: (path: string, userRole: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccessModule: (moduleIdentifier: string) => boolean;
  isAuthorizedForCurrentRoute: boolean | null;
  authChecked: boolean;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const auth = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [localUnitError, setLocalUnitError] = useState<string | null>(null);
  const [localUnitChecked, setLocalUnitChecked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (auth.isLoading || !auth.authChecked) return;

    if (auth.user === null && typeof window !== "undefined") {
      const host = window.location.hostname;
      const parts = host.split(".");
      let identifier: string | null = null;
      if (parts.length > 1) {
        identifier = parts[0];
      }

      fetch("/api/login", {
        method: "POST",
        headers: identifier
          ? { "X-Local-Unit-Identifier": identifier }
          : {},
      })
        .then(async res => {
          if (res.status === 400) {
            const data = await res.json();
            setLocalUnitError(data.message || "Local unit inválido.");
          }
          setLocalUnitChecked(true);
        })
        .catch(() => setLocalUnitChecked(true));
    } else {
      setLocalUnitChecked(true);
    }
  }, [auth.isLoading, auth.authChecked, auth.user]);

  useEffect(() => {
    if (localUnitError) {
      console.error("Erro de Unidade Local:", localUnitError);
    }
  }, [localUnitError]);

  if (!isMounted || !localUnitChecked) {
    return <LoadingSpinner />;
  }

  if (localUnitError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-red-600">
        <h1 className="text-2xl font-bold">Erro de Unidade Local</h1>
        <p className="text-gray-500">Acesse a aplicação usando um subdomínio válido.</p>
      </div>
    );
  }

  const publicRoutes = [route("login"), route("register")];
  const isPublicRoute = publicRoutes.some(route => pathname && pathname.startsWith(route));

  if (auth.isLoading || !auth.authChecked) {
    return <LoadingSpinner />;
  }

  if (!isPublicRoute && auth.isAuthorizedForCurrentRoute === false) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuthContext };
