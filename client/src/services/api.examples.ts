/**
 * Exemplos de Implementação: Cliente Axios + API
 * Este arquivo mostra como fazer chamadas à API corretamente
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// ============================================
// 1. CONFIGURAÇÃO BASE
// ============================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Criar instância do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// 2. INTERCEPTADORES
// ============================================

// Interceptador de Request (Adiciona token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de Response (Trata erros)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Se erro 401, usuário precisa fazer login novamente
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// 3. EXEMPLOS DE ENDPOINTS
// ============================================

// ✅ EXEMPLO 1: Listar Livros
export const getBooks = async () => {
  try {
    const response = await apiClient.get('/books');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
};

// ✅ EXEMPLO 2: Buscar Livro por ID
export const getBookById = async (id: string) => {
  try {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar livro ${id}:`, error);
    throw error;
  }
};

// ✅ EXEMPLO 3: Criar Livro (Com Autenticação)
export const createBook = async (bookData: {
  title: string;
  author: string;
  description: string;
  cover_url?: string;
}) => {
  try {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw error;
  }
};

// ✅ EXEMPLO 4: Atualizar Livro
export const updateBook = async (
  id: string,
  bookData: Partial<typeof createBook>
) => {
  try {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar livro ${id}:`, error);
    throw error;
  }
};

// ✅ EXEMPLO 5: Deletar Livro
export const deleteBook = async (id: string) => {
  try {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar livro ${id}:`, error);
    throw error;
  }
};

// ✅ EXEMPLO 6: Login
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Salvar token no localStorage
    localStorage.setItem('auth_token', token);
    
    // Adicionar ao header para próximas requisições
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// ✅ EXEMPLO 7: Logout
export const logout = () => {
  localStorage.removeItem('auth_token');
  delete apiClient.defaults.headers.Authorization;
};

// ✅ EXEMPLO 8: Buscar Perfil do Usuário
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

// ✅ EXEMPLO 9: Criar Review/Resumo
export const createReview = async (reviewData: {
  book_id: string;
  title: string;
  content: string;
  rating: number;
}) => {
  try {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar review:', error);
    throw error;
  }
};

// ✅ EXEMPLO 10: Listar Favoritos
export const getFavorites = async () => {
  try {
    const response = await apiClient.get('/favorites');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    throw error;
  }
};

// ============================================
// 4. TRATAMENTO DE ERROS GENÉRICO
// ============================================

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      details: error.response?.data,
    };
  }
  
  return {
    message: 'Erro desconhecido',
    status: 500,
    details: error,
  };
};

// ============================================
// 5. EXEMPLOS DE USO EM COMPONENTES
// ============================================

/*
// Exemplo em um componente React:

import { useEffect, useState } from 'react';
import { getBooks, handleApiError } from '@/services/api.examples';

export const BooksComponent = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {books.map((book) => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
};
*/

// ============================================
// 6. EXEMPLO DE CUSTOM HOOK
// ============================================

/*
import { useState, useEffect } from 'react';
import { ApiError, handleApiError } from '@/services/api.examples';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export const useApi = <T,>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const data = await fetchFn();
        setState({ data, loading: false, error: null });
      } catch (error) {
        const apiError = handleApiError(error);
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: apiError 
        }));
      }
    };

    fetchData();
  }, dependencies);

  return state;
};

// Uso:
// const { data: books, loading, error } = useApi(() => getBooks());
*/

export default apiClient;
