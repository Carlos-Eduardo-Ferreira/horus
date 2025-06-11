import { UserRole } from '@/types/auth';
import { route } from '@/config/namedRoutes';

export interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  redirectTo?: string;
  permission?: string;
}

export const routeConfigs: RouteConfig[] = [
  // Rotas administrativas
  {
    path: route('dashboard'),
    allowedRoles: ['master', 'admin', 'user'],
  },
  {
    path: route('users'),
    allowedRoles: ['master', 'admin', 'user'],
    permission: 'users.access',
  },
  {
    path: route('localUnits'),
    allowedRoles: ['master', 'admin', 'user'],
    permission: 'local_units.access',
  },
  {
    path: route('actions'),
    allowedRoles: ['master', 'admin', 'user'],
    permission: 'actions.access',
  },
  {
    path: route('modules'),
    allowedRoles: ['master', 'admin', 'user'],
    permission: 'modules.access',
  },
  
  // Rotas de empresa
  {
    path: route('companyDashboard'),
    allowedRoles: ['company'],
  },
  
  // Rotas de consumidor
  {
    path: route('consumerDashboard'),
    allowedRoles: ['consumer'],
  },
  
  // Rotas compartilhadas
  {
    path: route('preferences'),
    allowedRoles: ['master', 'admin', 'user', 'consumer', 'company'],
  },
];

export function canAccessRoute(
  path: string, 
  userRole: UserRole, 
  hasPermission?: (permission: string) => boolean
): boolean {
  const routeConfig = routeConfigs.find(config => path.startsWith(config.path));
  
  if (!routeConfig) return false;
  
  // Verifica se o perfil do usuário está autorizado para a rota
  if (!routeConfig.allowedRoles.includes(userRole)) return false;
  
  // Usuário com perfil 'master' sempre tem acesso a tudo
  if (userRole === 'master') return true;
  
  // Para os papéis 'admin' e 'user', verifica permissões específicas, se tiverem
  if (routeConfig.permission && ['admin', 'user'].includes(userRole) && hasPermission) {
    return hasPermission(routeConfig.permission);
  }
  
  // Usuários 'consumer' e 'company' têm acesso apenas com base no perfil
  return true;
}

export function getDefaultDashboard(userRole: UserRole): string {
  switch (userRole) {
    case 'master':
    case 'admin':
    case 'user':
      return route('dashboard');
    case 'company':
      return route('companyDashboard');
    case 'consumer':
      return route('consumerDashboard');
    default:
      return route('dashboard');
  }
}

export function getUnauthorizedRedirect(userRole: UserRole): string {
  return getDefaultDashboard(userRole);
}
