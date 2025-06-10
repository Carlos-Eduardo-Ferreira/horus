export const namedRoutes = {
  // Rotas públicas
  login: '/login',
  register: '/register',
  recoverPassword: '/recover-password',
  
  // Dashboards
  dashboard: '/dashboard',
  companyDashboard: '/company-dashboard',
  consumerDashboard: '/consumer-dashboard',
  
  // Rotas administrativas
  users: '/users',
  userNew: '/users/new',
  userEdit: (id: string | number) => `/users/${id}`,
  
  localUnits: '/local-units',
  localUnitNew: '/local-units/new',
  localUnitEdit: (id: string | number) => `/local-units/${id}`,
  
  actions: '/actions',
  actionNew: '/actions/new',
  actionEdit: (id: string | number) => `/actions/${id}`,
  
  modules: '/modules',
  moduleNew: '/modules/new',
  moduleEdit: (id: string | number) => `/modules/${id}`,
  
  // Rotas compartilhadas
  preferences: '/preferences',
} as const;

type SimpleRoutes = {
  [K in keyof typeof namedRoutes]: typeof namedRoutes[K] extends string 
    ? K 
    : never
}[keyof typeof namedRoutes];

type SingleParamRoutes = {
  [K in keyof typeof namedRoutes]: typeof namedRoutes[K] extends (id: string | number) => string 
    ? K 
    : never
}[keyof typeof namedRoutes];

export function route(name: SimpleRoutes): string;
export function route(name: SingleParamRoutes, id: string | number): string;
export function route(name: keyof typeof namedRoutes, ...params: (string | number)[]): string {
  const routeValue = namedRoutes[name];
  
  if (typeof routeValue === 'function') {
    return routeValue(params[0]);
  }
  
  return routeValue;
}

export type NamedRoute = keyof typeof namedRoutes;
