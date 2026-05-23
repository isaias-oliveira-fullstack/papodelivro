import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '@/services/api'
import { User, Book, Summary, Review, Favorite } from '@/types'
import { getImageUrl } from '@/utils/imageUtils'
import { Star, BookOpen, PenTool, Heart, MessageSquare } from 'lucide-react'
import CryptoJS from 'crypto-js'

interface PublicUserProfile extends User {
  description?: string
  createdAt?: string
  booksCount?: number
  summariesCount?: number
  reviewsCount?: number
  favoritesCount?: number
}

interface FavoriteWithBook extends Favorite {
  book?: Book
}

interface UserStats {
  booksCreated: number
  summariesCreated: number
  reviewsCreated: number
  favoritesList: number
  averageRating: number
}

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<PublicUserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [userBooks, setUserBooks] = useState<Book[]>([])
  const [userSummaries, setUserSummaries] = useState<Summary[]>([])
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [userFavorites, setUserFavorites] = useState<FavoriteWithBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'livros' | 'resumos' | 'avaliacoes' | 'favoritos'>('livros')

 const getAvatarUrl = (name: string, email?: string) => {
  if (email) {
    const emailHash = CryptoJS.MD5(email.trim().toLowerCase()).toString()

    return `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=200`
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=fff&size=200&bold=true`
}

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!username) {
        setError('Usuário não encontrado.')
        setLoading(false)
        return
      }

      try {
        // Tentar buscar perfil público do usuário
        const userResponse = await api.get(`/users/username/${encodeURIComponent(username)}/profile`)
        setUser(userResponse.data)

        // Buscar livros do usuário
        const booksResponse = await api.get(`/users/username/${encodeURIComponent(username)}/books`)
        setUserBooks(booksResponse.data || [])

        // Buscar resumos do usuário
        const summariesResponse = await api.get(`/users/username/${encodeURIComponent(username)}/summaries`)
        setUserSummaries(summariesResponse.data || [])

        // Buscar avaliações do usuário
        const reviewsResponse = await api.get(`/users/username/${encodeURIComponent(username)}/reviews`)
        setUserReviews(reviewsResponse.data || [])

        const favoritesResponse = await api.get(`/users/username/${encodeURIComponent(username)}/favorites`)
        const favoritesData = favoritesResponse.data || []
        setUserFavorites(favoritesData)

        // Calcular estatísticas
        setStats({
          booksCreated: booksResponse.data?.length || 0,
          summariesCreated: summariesResponse.data?.length || 0,
          reviewsCreated: reviewsResponse.data?.length || 0,
          favoritesList: favoritesData.length,
          averageRating: calculateAverageRating(reviewsResponse.data || []),
        })

        setError(null)
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
        setError('Não foi possível carregar o perfil deste usuário.')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [username])

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return parseFloat((sum / reviews.length).toFixed(1))
  }

  if (loading) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <p className="text-slate-600 dark:text-slate-400">Carregando perfil...</p>
      </section>
    )
  }

  if (error || !user) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Perfil não encontrado</h1>
          <p className="text-slate-600 dark:text-slate-400">{error || 'Este usuário não existe.'}</p>
          <Link to="/" className="inline-flex rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Voltar para Home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {/* Header do Perfil */}
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
          {/* Avatar */}
          <div className="shrink-0">
            <img
              src={getAvatarUrl(user.name, user.email)}
              alt={user.name}
              className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover shadow-lg"
            />
          </div>

          {/* Informações do Usuário */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-950 dark:text-white">{user.name}</h1>
              {user.email && <p className="text-slate-500 dark:text-slate-400">{user.email}</p>}
            </div>

            {user.description && (
              <p className="mt-3 text-slate-700 dark:text-slate-300">{user.description}</p>
            )}

            {/* Badges de Status */}
            <div className="flex flex-wrap gap-2 pt-2">
              {user.role === 'admin' && (
                <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  Administrador
                </span>
              )}
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Membro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'data desconhecida'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <BookOpen className="mx-auto mb-2 h-6 w-6 text-blue-600" />
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{stats.booksCreated}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Livros Criados</p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <PenTool className="mx-auto mb-2 h-6 w-6 text-green-600" />
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{stats.summariesCreated}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Resumos Feitos</p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <Star className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{stats.averageRating}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Classificação Média</p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <MessageSquare className="mx-auto mb-2 h-6 w-6 text-indigo-600" />
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{stats.reviewsCreated}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Avaliações</p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <Heart className="mx-auto mb-2 h-6 w-6 text-red-600" />
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{stats.favoritesList}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Favoritos</p>
          </div>
        </div>
      )}

      {/* Abas de Conteúdo */}
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        {/* Navegação de Abas */}
        <div className="mb-6 flex gap-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('livros')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'livros'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="mb-1 inline-block mr-2 h-4 w-4" />
            Livros ({userBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('resumos')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'resumos'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <PenTool className="mb-1 inline-block mr-2 h-4 w-4" />
            Resumos ({userSummaries.length})
          </button>
          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'avaliacoes'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Star className="mb-1 inline-block mr-2 h-4 w-4" />
            Avaliações ({userReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('favoritos')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'favoritos'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Heart className="mb-1 inline-block mr-2 h-4 w-4" />
            Favoritos ({userFavorites.length})
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'livros' && (
          <div>
            {userBooks.length === 0 ? (
              <p className="py-8 text-center text-slate-600 dark:text-slate-400">Nenhum livro criado ainda.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userBooks.map((book) => (
                  <Link key={book.id} to={`/livro/${book.slug}`} className="group">
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                      {(book.full_cover_url || book.cover_url) && (
                        <img
                          src={getImageUrl(book)}
                          alt={book.title}
                          className="h-40 w-full rounded-xl object-cover"
                        />
                      )}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-slate-950 transition group-hover:text-blue-600 dark:text-white">
                          {book.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{book.author}</p>
                        {book.category && (
                          <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                            {book.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'resumos' && (
  <div>
    {userSummaries.length === 0 ? (
      <p className="py-8 text-center text-slate-600 dark:text-slate-400">
        Nenhum resumo criado ainda.
      </p>
    ) : (
      <div className="space-y-4">
        {userSummaries.map((summary) => {
          const book = userBooks.find(
            (book) => book.id === summary.book_id
          )

          return (
            <div
              key={summary.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              {(book?.full_cover_url || book?.cover_url) && (
                <img
                  src={getImageUrl(book)}
                  alt={book.title}
                  className="h-24 w-20 rounded-lg object-cover flex-shrink-0"
                />
              )}

              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {book?.title || 'Livro sem título'}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {book?.author || 'Autor desconhecido'}
                </p>

                {summary.status && (
                  <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    {summary.status}
                  </span>
                )}

                {summary.content && (
                  <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {summary.content}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )}
  </div>
)}

  {activeTab === 'avaliacoes' && (
  <div>
    {userReviews.length === 0 ? (
      <p className="py-8 text-center text-slate-600 dark:text-slate-400">
        Nenhuma avaliação feita ainda.
      </p>
    ) : (
      <div className="space-y-4">
        {userReviews.map((review) => {
          const book = userBooks.find(
            (book) => book.id === review.book_id
          )

          return (
            <div
              key={review.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              {/* CAPA DO LIVRO */}
              {(book?.full_cover_url || book?.cover_url) && (
                <img
                  src={getImageUrl(book)}
                  alt={book?.title || 'Livro'}
                  className="h-24 w-20 rounded-lg object-cover shrink-0"
                />
              )}

              {/* CONTEÚDO */}
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-950 dark:text-white">
                    {book?.title || 'Livro desconhecido'}
                  </h3>

                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {book?.author || 'Autor desconhecido'}
                </p>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {review.content}
                </p>

                {review.createdAt && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )}
  </div>
)}

        {activeTab === 'favoritos' && (
          <div>
            {userFavorites.length === 0 ? (
              <p className="py-8 text-center text-slate-600 dark:text-slate-400">
                Nenhum favorito adicionado ainda.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userFavorites.map((favorite) => (
                  <Link
                    key={favorite.id}
                    to={`/livro/${favorite.book?.slug}`}
                    className="group"
                  >
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                      {(favorite.book?.full_cover_url || favorite.book?.cover_url) && (
                        <img
                          src={getImageUrl(favorite.book as Book)}
                          alt={favorite.book?.title || 'Livro favorito'}
                          className="h-40 w-full rounded-xl object-cover"
                        />
                      )}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-slate-950 transition group-hover:text-blue-600 dark:text-white">
                          {favorite.book?.title || 'Livro favorito'}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {favorite.book?.author || 'Autor desconhecido'}
                        </p>
                        {favorite.book?.category && (
                          <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                            {favorite.book?.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default PublicProfilePage
