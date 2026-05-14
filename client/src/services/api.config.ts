/**
 * Configuração da API
 * Este arquivo centraliza todas as variáveis de ambiente relacionadas à API
 */

// URL base da API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
  const url = `${API_BASE_URL}${endpoint}`;
  
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
