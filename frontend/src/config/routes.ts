import { UserRole } from '@/types/auth';
import { route } from '@/config/namedRoutes';

export interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  redirectTo?: string;
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
  },
  {
    path: route('localUnits'),
    allowedRoles: ['master', 'admin', 'user'],
  },
  {
    path: route('actions'),
    allowedRoles: ['master', 'admin', 'user'],
  },
  {
    path: route('modules'),
    allowedRoles: ['master', 'admin', 'user'],
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

export function canAccessRoute(path: string, userRole: UserRole): boolean {
  const routeConfig = routeConfigs.find(config => path.startsWith(config.path));
  return routeConfig ? routeConfig.allowedRoles.includes(userRole) : false;
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
