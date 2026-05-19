/**
 * Configuração da API
 * Este arquivo centraliza todas as variáveis de ambiente relacionadas à API.
 */

const rawApiUrl = (import.meta.env.VITE_API_URL ?? '').trim();
const normalizedApiUrl = rawApiUrl.replace(/\/+$|\s+$/g, '');
const apiRootUrl = normalizedApiUrl.replace(/\/api$/, '');

export const API_BASE_URL = normalizedApiUrl
  ? normalizedApiUrl.endsWith('/api')
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : import.meta.env.MODE === 'development'
  ? 'http://localhost:3333/api'
  : '/api';

export const API_ORIGIN = apiRootUrl;

// Configuração de headers padrão
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Função helper para fazer chamadas à API
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
  });

  return response;
};

// Exemplo de como usar em componentes:
// import { apiCall } from '@/services/api.config';
// 
// const response = await apiCall('/books');
// const data = await response.json();
