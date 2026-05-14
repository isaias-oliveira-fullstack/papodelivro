import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Book } from '@/types'

const MyBookDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const { signed } = useAuth()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryId, setSummaryId] = useState<number | string | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const coverUrl = book?.full_cover_url || book?.cover_url || ''
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadBook = async () => {
      
      //console.log('Carregando livro com ID:', bookId);
      
      if (!bookId) return
      setLoading(true)
      try {
        const response = await api.get(`/users/me/books/${bookId}`)
        const data = response.data as Book
        setBook(data)
        setTitle(data.title)
        setAuthor(data.author)
        setCategory(data.category ?? '')
        setSummary(data.summary ?? '')
        setSummaryId((data as any).summary_id ?? null)
      } catch (err) {
        console.error('Erro ao carregar livro:', err)
        setError('Não foi possível carregar os dados do livro.')
      } finally {
        setLoading(false)
      }
    }

    loadBook()
  }, [bookId])

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCoverImage(event.target.files[0])
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!bookId) return
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (!title || !author || !category) {
      setError('Preencha título, autor e categoria.')
      setSubmitting(false)
      return
    }

    try {
      const bookForm = new FormData()
      bookForm.append('title', title)
      bookForm.append('author', author)
      bookForm.append('category', category)
      if (coverImage) {
        bookForm.append('coverImage', coverImage)
      }

      const bookResponse = await api.patch(`/users/me/books/${bookId}`, bookForm)
      let updatedBook = bookResponse.data as Book

      if (summary && summaryId) {
        const summaryForm = new FormData()
        summaryForm.append('content', summary)
        await api.patch(`/summaries/${summaryId}`, summaryForm)
      } else if (summary && !summaryId && book?.slug) {
        const summaryForm = new FormData()
        summaryForm.append('title', title)
        summaryForm.append('author', author)
        summaryForm.append('category', category)
        summaryForm.append('content', summary)
        summaryForm.append('slug', book.slug)
        summaryForm.append('coverUrlMock', book.cover_url ?? '')
        await api.post('/summaries', summaryForm)
      }

      setBook(updatedBook)
      setSuccess('Livro atualizado com sucesso.')
    } catch (err: unknown) {
      console.error(err)
      const message = typeof err === 'object' && err !== null && 'response' in err ? (err as any).response?.data?.error : null
      setError(message || 'Não foi possível atualizar o livro.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!bookId || !window.confirm('Tem certeza de que deseja excluir este livro?')) return

    try {
      await api.delete(`/users/me/books/${bookId}`)
      navigate('/meus-livros')
    } catch (err) {
      console.error(err)
      setError('Não foi possível excluir o livro.')
    }
  }

  if (!signed) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Acesso negado</h1>
          <p className="text-slate-600 dark:text-slate-400">Faça login para acessar seus livros.</p>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <p className="text-slate-600 dark:text-slate-400">Carregando livro...</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Detalhes do livro</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Edite as informações do seu livro ou exclua-o.</p>
          </div>
          <Link to="/meus-livros" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            Voltar para meus livros
          </Link>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        {coverUrl && (
          <div className="mb-6 overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <img
              src={coverUrl}
              alt={`Capa de ${book?.title}`}
              className="h-80 w-full object-cover"
            />
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <input
              type="text"
              placeholder="Autor"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <textarea
            placeholder="Escreva seu resumo aqui..."
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={6}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <div className="rounded-4xl border border-slate-300 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <label className="block text-sm font-medium">Capa do livro</label>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleCoverChange}
              className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:text-slate-200 dark:file:bg-slate-100 dark:file:text-slate-950"
            />
          </div>
          {book?.status && (
            <div className="space-y-3">
              <p 
                className="text-sm text-slate-500 dark:text-slate-400">
                    Status atual: <strong>{book.status}</strong>
             </p>
              {book.status === 'PENDING' && (
                <p className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-200">
                  Seu livro está aguardando aprovação do administrador antes de ficar público.
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {submitting ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-full border border-rose-500 bg-white px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500 dark:bg-slate-950 dark:text-rose-300 dark:hover:bg-rose-900/50"
            >
              Excluir livro
            </button>
          </div>
          {success && <p className="text-sm text-emerald-600 dark:text-emerald-300">{success}</p>}
          {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        </form>
      </div>
    </section>
  )
}

export default MyBookDetailPage
