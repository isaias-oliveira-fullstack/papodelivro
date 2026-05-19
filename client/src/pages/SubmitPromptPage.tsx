import { useState, useEffect, FormEvent } from 'react'
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Book } from '../types'

const SubmitPromptPage = () => {
  const location = useLocation()
  const params = useParams<{ slug?: string }>()
  const state = location.state as { book?: Book } | null
  const navigate = useNavigate()
  const { signed } = useAuth()
  const [promptText, setPromptText] = useState('')
  const [title, setTitle] = useState(state?.book?.title ?? '')
  const [author, setAuthor] = useState(state?.book?.author ?? '')
  const [category, setCategory] = useState(state?.book?.category ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingBook, setIsLoadingBook] = useState(false)

  useEffect(() => {
    if (state?.book) {
      setTitle(state.book.title ?? '')
      setAuthor(state.book.author ?? '')
      setCategory(state.book.category ?? '')
      return
    }

    if (params.slug) {
      setIsLoadingBook(true)
      api
        .get(`/books/${params.slug}`)
        .then((response) => {
          const book = response.data as Book
          setTitle(book.title ?? '')
          setAuthor(book.author ?? '')
          setCategory(book.category ?? '')
        })
        .catch((err) => {
          console.error('Erro ao carregar livro para prompt:', err)
          setError('Não foi possível carregar os dados do livro.')
        })
        .finally(() => setIsLoadingBook(false))
    }
  }, [params.slug, state])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!promptText || !title || !author || !category) {
      setError('Preencha todos os campos para enviar o prompt.')
      setIsSubmitting(false)
      return
    }

    try {
      await api.post('/prompt', { title, author, category, promptText })
      navigate('/')
    } catch (err) {
      console.error('Erro ao enviar prompt:', err)
      const errorData =
        err && typeof err === 'object' && 'response' in err && (err as any).response?.data?.error
          ? (err as any).response.data.error
          : null
      const apiError = typeof errorData === 'string' ? errorData : 'Falha ao enviar o prompt. Tente novamente mais tarde.'
      setError(apiError)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingBook) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white/90 p-8 text-center shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Carregando...</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">Aguarde enquanto buscamos os dados do livro.</p>
      </section>
    )
  }

  if (!signed) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white/90 p-8 text-center shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Enviar Prompt</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">
          Você precisa estar logado para enviar prompts.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={`/login?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
            //to="/login"
            //state={{ from: location }}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Fazer Login
          </Link>
          <Link
            //to="/register"
            to={`/register?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Cadastrar-se
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white/90 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Enviar Prompt</p>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Compartilhe sua ideia</h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300">
            Preencha o formulário abaixo para enviar um prompt de livro e contribuir com o acervo.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Livro
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Autor
            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Categoria
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Prompt
            <textarea
              value={promptText}
              onChange={(event) => setPromptText(event.target.value)}
              rows={8}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Prompt'}
          </button>
          {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        </form>
      </div>
    </section>
  )
}

export default SubmitPromptPage
