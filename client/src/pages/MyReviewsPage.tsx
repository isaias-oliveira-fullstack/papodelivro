import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import type { Review } from '../types'

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { signed } = useAuth()

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await api.get('/reviews/my')
        setReviews(response.data as Review[])
      } catch (err) {
        setError('Não foi possível carregar suas resenhas.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (signed) {
      loadReviews()
    } else {
      setLoading(false)
    }
  }, [signed])

  if (!signed) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Minhas Resenhas</h1>
          <p className="text-slate-600 dark:text-slate-400">Faça login para ver e gerenciar suas resenhas.</p>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <p className="text-slate-600 dark:text-slate-400">Carregando resenhas...</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Minhas Resenhas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Acompanhe o histórico de suas avaliações de livros.</p>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {reviews.length === 0 ? (
        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
          <p>Você ainda não escreveu nenhuma resenha.</p>
        </section>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {review.book?.cover_url && (
                  <img src={review.book.cover_url} alt={`Capa de ${review.book.title}`} className="h-32 w-24 rounded-3xl object-cover" />
                )}
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 text-slate-950 dark:text-white">
                    <h2 className="text-xl font-semibold">{review.book?.title ?? 'Livro desconhecido'}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{review.book?.author ?? 'Autor desconhecido'}</p>
                  </div>
                  {review.rating !== undefined && <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">Avaliação: {review.rating}/5</span>}
                  {review.content && <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{review.content}</p>}
                  {review.createdAt && <p className="text-sm text-slate-500 dark:text-slate-400">Publicado em {new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyReviewsPage
