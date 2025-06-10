import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth';
import { AuthState, User, UserRole } from '@/types/auth';
import { canAccessRoute, getUnauthorizedRedirect } from '@/config/routes';
import { route } from '@/config/namedRoutes';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [authChecked, setAuthChecked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Marcar quando estamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const setUser = useCallback((user: User | null) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setAuthState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  // Função para carregar dados do usuário
  const loadUser = useCallback(async () => {
    if (!isClient) {
      return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      setAuthChecked(true);
      return;
    }

    try {
      const userData = await authService.getCurrentUser(token);
      if (userData && userData.user) {
        setUser(userData.user as User);
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  }, [setUser, setLoading, isClient]);

  // Função para verificar autorização de rota
  const checkRouteAuthorization = useCallback((path: string, userRole: UserRole) => {
    return canAccessRoute(path, userRole);
  }, []);

  // Função para fazer logout
  const logout = useCallback(async () => {
    setLoading(true);
    
    if (isClient) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await authService.logout(token);
        } catch (error) {
          console.error('Error during logout:', error);
        }
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    setUser(null);
    setLoading(false);
    router.push(route('login'));
  }, [router, setUser, setLoading, isClient]);

  // Verificar autorização imediatamente quando temos token ou user
  const isAuthorizedForCurrentRoute = useCallback(() => {
    if (!pathname || !authChecked || !isClient) return null;

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [route('login'), route('register')];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (isPublicRoute) {
      return true;
    }

    // Para rotas protegidas, precisa estar autenticado
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }

    // Verifica se tem permissão para a rota específica
    return checkRouteAuthorization(pathname, authState.user.role);
  }, [pathname, authState.isAuthenticated, authState.user, authChecked, checkRouteAuthorization, isClient]);

  // Carregar usuário quando o cliente estiver pronto
  useEffect(() => {
    if (isClient) {
      loadUser();
    }
  }, [loadUser, isClient]);

  // Verificar autenticação e autorização quando a rota mudar
  useEffect(() => {
    if (!authChecked || !pathname || !isClient) return;

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [route('login'), route('register')];
    const isPublicRoute = publicRoutes.some(routePath => pathname.startsWith(routePath));

    if (isPublicRoute) {
      // Se está logado e tentando acessar rota pública, redireciona para dashboard
      if (authState.isAuthenticated && authState.user) {
        const defaultDashboard = getUnauthorizedRedirect(authState.user.role);
        router.replace(defaultDashboard);
      }
      return;
    }

    // Verificar se está autenticado
    if (!authState.isAuthenticated) {
      router.replace(route('login'));
      return;
    }

    // Verificar autorização para a rota
    if (authState.user && !checkRouteAuthorization(pathname, authState.user.role)) {
      const redirectTo = getUnauthorizedRedirect(authState.user.role);
      router.replace(redirectTo);
      return;
    }
  }, [
    pathname, 
    authState.isAuthenticated, 
    authState.user, 
    authChecked,
    isClient,
    router, 
    checkRouteAuthorization
  ]);

  return {
    ...authState,
    loadUser,
    logout,
    checkRouteAuthorization,
    isAuthorizedForCurrentRoute: isAuthorizedForCurrentRoute(),
    authChecked,
  };
}
