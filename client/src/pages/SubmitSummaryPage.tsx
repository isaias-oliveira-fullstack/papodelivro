import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Book, Summary } from '../types'
import { getImageUrl } from '../utils/imageUtils'

const SubmitSummaryPage = () => {
  const location = useLocation()
  const state = location.state as { book?: Book; summary?: Summary } | null
  const summaryToEdit = state?.summary
  const bookFromState = state?.book
  const prefilledBook = bookFromState ?? (summaryToEdit ? {
    title: summaryToEdit.title,
    author: summaryToEdit.author,
    category: summaryToEdit.category ?? '',
    cover_url: summaryToEdit.cover_url,
    slug: summaryToEdit.slug,
  } : undefined)
  const isEditing = !!summaryToEdit
  const isUpdating = !!bookFromState && !summaryToEdit
  const shouldReadOnlyBookFields = !!bookFromState && !summaryToEdit
  const navigate = useNavigate()
  const { signed } = useAuth()
  const [title, setTitle] = useState(prefilledBook?.title ?? '')
  const [author, setAuthor] = useState(prefilledBook?.author ?? '')
  const [category, setCategory] = useState(prefilledBook?.category ?? '')
  const [content, setContent] = useState(summaryToEdit?.content ?? '')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [mySummaries, setMySummaries] = useState<Summary[]>([])
  const [loadingMySummaries, setLoadingMySummaries] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (state) {
      setTitle(prefilledBook?.title ?? '')
      setAuthor(prefilledBook?.author ?? '')
      setCategory(prefilledBook?.category ?? '')
      setContent(summaryToEdit?.content ?? '')
    }
  }, [state, prefilledBook, summaryToEdit])

  useEffect(() => {
    const fetchMissingBookData = async () => {
      if (!isEditing || category || !summaryToEdit?.slug) return

      try {
        const response = await api.get(`/books/${summaryToEdit.slug}`)
        const book = response.data as Book

        setTitle((prev) => prev || book.title || '')
        setAuthor((prev) => prev || book.author || '')
        setCategory((prev) => prev || book.category || '')
      } catch (fetchError) {
        console.error('Falha ao buscar dados do livro para edição de resumo:', fetchError)
      }
    }

    fetchMissingBookData()
  }, [isEditing, category, summaryToEdit?.slug])

  const fetchMySummaries = useCallback(async () => {
    setLoadingMySummaries(true)
    try {
      const response = await api.get('/my-summaries')
      setMySummaries(response.data as Summary[])
    } catch (err) {
      console.error('Falha ao buscar envios:', err)
    } finally {
      setLoadingMySummaries(false)
    }
  }, [])

  useEffect(() => {
    if (signed) {
      fetchMySummaries()
    } else {
      setLoadingMySummaries(false)
    }
  }, [signed, fetchMySummaries])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setMessage('')

    if (!title || !author || !category || !content) {
      setError('Por favor, preencha todos os campos obrigatórios.')
      setIsSubmitting(false)
      return
    }

    if (isEditing && !summaryToEdit?.id) {
      setError('Resumo inválido para edição.')
      setIsSubmitting(false)
      return
    }

    try {
      if (isEditing) {
        const formData = new FormData()
        formData.append('content', content)
        if (coverImage) {
          formData.append('coverImage', coverImage)
        }

        await api.patch(`/summaries/${summaryToEdit?.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('Resumo atualizado com sucesso!')
      } else {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('author', author)
        formData.append('category', category)
        formData.append('content', content)

        if (isUpdating && prefilledBook?.slug) {
          formData.append('slug', prefilledBook.slug)
        }

        if (isUpdating) {
          const filename = prefilledBook?.cover_url?.split('/').pop() ?? ''
          formData.append('coverUrlMock', filename)
        } else if (coverImage) {
          formData.append('coverImage', coverImage)
        } else {
          setError('Para um novo livro, a imagem da capa é obrigatória.')
          setIsSubmitting(false)
          return
        }

        await api.post('/summaries', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('Resumo enviado para avaliação com sucesso!')
      }

      navigate('/meus-resumos')
    } catch (err: unknown) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as any).response?.data?.error ?? 'Erro desconhecido ao enviar.'
          : 'Erro desconhecido ao enviar.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0])
    }
  }

  if (!signed) {
    return (
      <section className="flex min-h-[57vh] items-center justify-center">
         <div className="mx-auto w-full max-w-xl rounded-lg border p-8 shadow-sm relative overflow-hidden bg-primary dark:bg-dark-primary">
        <div className="absolute top-0 left-0 z-1 h-full w-full bg-[url(/assets/images/hero/default-bg.png)] bg-cover bg-center bg-no-repeat opacity-70 dark:opacity-20"></div>
        <div className="relative z-10">
        <div className="space-y-4 text-center mb-6">
          <h2 className="text-3xl font-semibold text-slate-100!">Envie seu Resumo</h2>
          <p className="text-slate-300! leading-6">Para realizar envios de resumos e acompanhar o andamento das submissões, é necessário estar autenticado na plataforma.</p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/login?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
            //state={{ from: location }}
            className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-gray-200 transition cursor-pointer"
          >
            Fazer Login
          </Link>
          <Link
            //to="/register"
            to={`/register?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
            className="rounded-full border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-slate-900 transition cursor-pointer"
          >
            Cadastrar-se
          </Link>
          </div>
        </div>
        {prefilledBook && (
          <div className="mt-8 rounded-4xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
            {prefilledBook.cover_url && (
              <img src={getImageUrl(prefilledBook)} alt={`Capa de ${prefilledBook.title}`} className="mb-4 h-48 w-full rounded-3xl object-cover" />
            )}
            <p className="text-slate-700 dark:text-slate-300">
              Livro: <strong>{prefilledBook.title}</strong> por {prefilledBook.author}
            </p>
          </div>
        )}
      </div>
      </section>
    )
  }

  return (
    <section className="pb-12 space-y-6">
      <div className="bg-gray-200 py-6 transition dark:bg-slate-900/95 sm:p-8">
        <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
          <h2 className="text-3xl font-semibold mb-0">Enviar Resumo</h2>
          <p className="mt-2 text-sm">Envie seu resumo sobre o livro</p>
        </div>
      </div>
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-4xl border border-slate-200 bg-gray-200 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
            {isEditing ? 'Editar Resumo' : isUpdating ? 'Complete o Resumo' : 'Envie um Novo Resumo'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {isEditing
              ? `Você está editando o resumo do livro "${prefilledBook?.title}".`
              : isUpdating
              ? `Você está enviando um resumo para o livro "${prefilledBook?.title}".`
              : 'Preencha todos os campos. Após o envio, seu resumo será avaliado.'}
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Nome do Livro"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            readOnly={shouldReadOnlyBookFields}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
          <input
            type="text"
            placeholder="Autor do Livro"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
            readOnly={shouldReadOnlyBookFields}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            readOnly={shouldReadOnlyBookFields}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
          <textarea
            placeholder="Escreva seu resumo aqui..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={8}
            required
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />

          {prefilledBook ? (
            <div className="rounded-4xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Capa do Livro:</label>
              <div className="mt-4">
                {prefilledBook?.cover_url ? (
                  <img src={getImageUrl(prefilledBook)} alt={`Capa de ${title}`} className="h-56 w-full rounded-3xl object-cover" />
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">Capa não disponível.</p>
                )}
              </div>

              <label className="mt-6 block rounded-4xl border border-slate-300 bg-white p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <span className="text-sm font-medium">Alterar imagem de capa (opcional)</span>
                <span className="mt-3 block text-sm text-slate-500 dark:text-slate-400">JPEG ou PNG</span>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  className="mt-4 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:text-slate-200 dark:file:bg-slate-100 dark:file:text-slate-950"
                />
                {coverImage && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Arquivo selecionado: {coverImage.name}</p>}
              </label>
            </div>
          ) : (
            <label className="block rounded-4xl border border-slate-300 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <span className="text-sm font-medium">Imagem de capa</span>
              <span className="mt-3 block text-sm text-slate-500 dark:text-slate-400">JPEG ou PNG</span>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                required
                className="mt-4 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:text-slate-200 dark:file:bg-slate-100 dark:file:text-slate-950"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isSubmitting ? 'Enviando...' : isEditing ? 'Atualizar resumo' : 'Enviar para Avaliação'}
          </button>
          {message && <p className="text-sm text-emerald-600 dark:text-emerald-300">{message}</p>}
          {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        </form>
      </div>

      <aside className="rounded-4xl border border-slate-200 bg-gray-200 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Meus Envios</h3>
            <p className="text-slate-500 dark:text-slate-400">Acompanhe o status dos seus resumos enviados.</p>
          </div>
          {loadingMySummaries ? (
            <p className="text-slate-600 dark:text-slate-400">Carregando seus envios...</p>
          ) : mySummaries.length > 0 ? (
            <ul className="space-y-4">
              {mySummaries.map((summary) => (
                <li key={summary.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                  <Link to={summary.slug ? `/livro/${summary.slug}` : '#'} className="flex items-center gap-4">
                    {summary.cover_url && <img src={getImageUrl(summary)} alt={`Capa do livro ${summary.title}`} className="h-16 w-12 rounded-2xl object-cover" />}
                    <div className="space-y-1 text-sm text-slate-900 dark:text-slate-100">
                      <p className="font-semibold">{summary.title}</p>
                      <p className="text-slate-500 dark:text-slate-400">por {summary.author}</p>
                    </div>
                    {typeof summary.status === 'string' && (
                      <span className="ml-auto rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {summary.status}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">Você ainda não enviou nenhum resumo.</p>
          )}
        </div>
      </aside>
      </div>
      </div>
    </section>
  )
}

export default SubmitSummaryPage
