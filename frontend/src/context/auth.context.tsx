"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthState, UserRole } from "@/types/auth";
import { usePathname } from "next/navigation";
import { route } from "@/config/namedRoutes";

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

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-white">
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.4013 72.5987 9.08144 50 9.08144C27.4013 9.08144 9.08144 27.4013 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  </div>
);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const auth = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Não renderiza nada até estar montado no cliente para evitar hidratação
  if (!isMounted) {
    return <LoadingSpinner />;
  }

  // Rotas públicas que não precisam de autenticação usando rotas nomeadas
  const publicRoutes = [route('login'), route('register')];
  const isPublicRoute = publicRoutes.some(route => pathname && pathname.startsWith(route));

  // Se ainda está carregando ou verificando autenticação, mostra loading
  if (auth.isLoading || !auth.authChecked) {
    return <LoadingSpinner />;
  }

  // Se não está autorizado para a rota atual, mostra loading enquanto redireciona
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