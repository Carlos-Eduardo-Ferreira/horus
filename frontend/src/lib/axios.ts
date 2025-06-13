import axios, { InternalAxiosRequestConfig } from 'axios';

function getLocalUnitHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts.length > 1) {
      return { "X-Local-Unit-Identifier": parts[0] };
    }
  }
  return {};
}

// Interceptor para adicionar automaticamente o header em todas as requisições
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const localUnitHeaders = getLocalUnitHeader();
    
    // Usa uma abordagem type-safe para definir headers
    if (Object.keys(localUnitHeaders).length > 0) {
      Object.entries(localUnitHeaders).forEach(([key, value]) => {
        if (config.headers) {
          config.headers[key] = value;
        }
      });
    }
    
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

export default axios;
