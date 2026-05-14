import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface SummaryItem {
  id: number | string
  title: string
  author: string
  category?: string
  status?: string
  slug?: string
  cover_url?: string
  content?: string
}

const MySummariesPage = () => {
  const [summaries, setSummaries] = useState<SummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { signed } = useAuth()
  const navigate = useNavigate()

  const handleEdit = (summary: SummaryItem) => {
    navigate('/enviar-resumo', {
      state: {
        book: {
          title: summary.title,
          author: summary.author,
          category: summary.category,
          cover_url: summary.cover_url,
          slug: summary.slug,
        },
        summary,
      },
    })
  }

  const handleDelete = async (summaryId: number | string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este resumo?')) return

    try {
      await api.delete(`/summaries/${summaryId}`)
      setSummaries((prev) => prev.filter((item) => String(item.id) !== String(summaryId)))
      setError(null)
    } catch (err) {
      console.error('Erro ao excluir resumo:', err)
      setError('Não foi possível excluir seu resumo. Tente novamente.')
    }
  }

  useEffect(() => {
    const loadSummaries = async () => {
      try {
        const response = await api.get('/my-summaries')
        setSummaries(response.data as SummaryItem[])
      } catch (err) {
        setError('Não foi possível carregar seus resumos.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (signed) {
      loadSummaries()
    } else {
      setLoading(false)
    }
  }, [signed])

  if (!signed) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Meus Resumos</h1>
          <p className="text-slate-600 dark:text-slate-400">Faça login para acompanhar seus resumos enviados.</p>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <p className="text-slate-600 dark:text-slate-400">Carregando seus resumos...</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Meus Resumos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Veja o status dos resumos que você enviou.</p>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {summaries.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <p>Você ainda não enviou resumos.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {summaries.map((summary) => (
            <div
              key={summary.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="flex items-start gap-4">
                {summary.cover_url && <img src={summary.cover_url} alt={`Capa de ${summary.title}`} className="h-28 w-20 rounded-3xl object-cover" />}
                <div className="space-y-3">
                  <Link
                    to={summary.slug ? `/livro/${summary.slug}` : '#'}
                    className="group block"
                  >
                    <h2 className="text-xl font-semibold text-slate-950 transition group-hover:text-slate-700 dark:text-white">{summary.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{summary.author}</p>
                    {summary.status && <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">{summary.status}</span>}
                  </Link>
                </div>
              </div>
              <div className="mt-5 flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleEdit(summary)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(summary.id)}
                  className="inline-flex items-center justify-center rounded-full border border-rose-500 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500 dark:bg-slate-950 dark:text-rose-300 dark:hover:bg-rose-900/50"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MySummariesPage
