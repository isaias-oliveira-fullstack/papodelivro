import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/services/api'

interface FavoritesContextData {
  favorites: string[]
  toggleFavorite: (slug: string) => Promise<void>
  isFavorite: (slug?: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined)
const FAVORITES_STORAGE_KEY = '@PapoDeLivro:favorites'

interface FavoritesProviderProps {
  children: ReactNode
}

const isSlug = (value: unknown): value is string => typeof value === 'string'

const extractFavoriteSlugs = (data: unknown) => {
  if (!Array.isArray(data)) return []
  return data
    .map((item: any) => item?.slug)
    .filter(isSlug)
}

const loadFavoritesFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isSlug) : []
  } catch {
    return []
  }
}

const saveFavoritesToStorage = (favorites: string[]) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // ignore localStorage errors
  }
}

const tryFetchFavoriteSlugs = async (): Promise<string[] | null> => {
  const urls = ['/favorites', '/users/me/favorites', '/me/favorites', '/users/favorites']

  for (const url of urls) {
    try {
      const response = await api.get(url)
      return extractFavoriteSlugs(response.data)
    } catch (error: unknown) {
      const status = typeof error === 'object' && error !== null && 'response' in error ? (error as any).response?.status : null
      if (status !== 404) {
        console.error(`Erro ao carregar favoritos no endpoint ${url}:`, error)
      }
    }
  }

  return null
}

const tryPostFavorite = async (slug: string): Promise<boolean> => {
  const attempts = [
    () => api.post('/favorites', { slug }),
    () => api.post('/favorites', { bookSlug: slug }),
    () => api.post('/favorites', { book_slug: slug }),
    () => api.post('/favorites', { bookId: slug }),
    () => api.post('/favorites', { book_id: slug }),
    () => api.post('/favorites', { id: slug }),
    () => api.post(`/favorites/${encodeURIComponent(slug)}`),
    () => api.post(`/favorites/${encodeURIComponent(slug)}/toggle`),
    () => api.post(`/books/${encodeURIComponent(slug)}/favorite`),
    () => api.post(`/books/${encodeURIComponent(slug)}/bookmark`),
  ]

  for (const attempt of attempts) {
    try {
      await attempt()
      return true
    } catch (error: unknown) {
      const status =
        typeof error === 'object' &&
        error !== null &&
        'response' in error
          ? (error as any).response?.status
          : null

      if (status && status !== 400 && status !== 404) {
        console.error('Erro ao salvar favorito no endpoint:', error)
      }
    }
  }

  return false
}

const tryDeleteFavorite = async (slug: string): Promise<boolean> => {
  const attempts = [
    () => api.delete(`/favorites/${encodeURIComponent(slug)}`),
    () => api.delete(`/users/me/favorites/${encodeURIComponent(slug)}`),
    () => api.delete(`/books/${encodeURIComponent(slug)}/favorite`),
  ]

  for (const attempt of attempts) {
    try {
      await attempt()
      return true
    } catch (error: unknown) {
      const status = typeof error === 'object' && error !== null && 'response' in error ? (error as any).response?.status : null
      if (status !== 404 && status !== null) {
        console.error('Erro ao remover favorito no endpoint:', error)
      }
    }
  }

  return false
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<string[]>([])
  const { signed } = useAuth()

  useEffect(() => {
    const loadFavorites = async () => {
      if (!signed) {
        setFavorites([])
        return
      }

      const favoriteSlugs = await tryFetchFavoriteSlugs()

      if (favoriteSlugs) {
        setFavorites(favoriteSlugs)
        saveFavoritesToStorage(favoriteSlugs)
        return
      }

      const storedFavorites = loadFavoritesFromStorage()
      setFavorites(storedFavorites)
    }

    loadFavorites()
  }, [signed])

  const setFavoritesAndStore = (nextFavorites: string[]) => {
    setFavorites(nextFavorites)
    saveFavoritesToStorage(nextFavorites)
  }

  const toggleFavorite = async (slug: string) => {
    if (!signed) {
      throw new Error('Autenticação necessária para favoritar livros.')
    }

    const isAlreadyFavorite = favorites.includes(slug)

    if (isAlreadyFavorite) {
      const removedOnServer = await tryDeleteFavorite(slug)
      setFavoritesAndStore(favorites.filter((item) => item !== slug))
      if (!removedOnServer) {
        console.warn('Favorito removido apenas localmente porque nenhum endpoint de favoritos estava disponível.')
      }
    } else {
      const createdOnServer = await tryPostFavorite(slug)
      setFavoritesAndStore([...favorites, slug])
      if (!createdOnServer) {
        console.warn('Favorito criado apenas localmente porque nenhum endpoint de favoritos estava disponível.')
      }
    }
  }

  const isFavorite = (slug?: string) => {
    return !!slug && favorites.includes(slug)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoritesContextData => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
