import { ChangeEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Book } from '@/types'

const MyBooksPage = () => {
  const { signed } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryId, setSummaryId] = useState<number | string | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resetForm = () => {
    setEditingBook(null)
    setTitle('')
    setAuthor('')
    setCategory('')
    setSummary('')
    setSummaryId(null)
    setCoverImage(null)
    setError('')
    setSuccess('')
  }

  const loadBooks = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users/me/books')
      setBooks(response.data as Book[])
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar seus livros.')
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter((book) => {
    if (statusFilter === 'ALL') return true
    return book.status?.toUpperCase() === statusFilter
  })

  const pendingCount = books.filter((book) => book.status === 'PENDING').length

  useEffect(() => {
    if (signed) {
      loadBooks()
    } else {
      setLoading(false)
    }
  }, [signed])

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setTitle(book.title)
    setAuthor(book.author)
    setCategory(book.category ?? '')
    setSummary(book.summary ?? '')
    setSummaryId(book.summary_id ?? null)
    setCoverImage(null)
    setError('')
    setSuccess('')
  }

  const editingCoverUrl = editingBook?.full_cover_url || editingBook?.cover_url || ''

  const handleDelete = async (bookId: number | string | undefined) => {
    if (!bookId) return
    if (!window.confirm('Tem certeza de que deseja excluir este livro?')) return

    try {
      await api.delete(`/users/me/books/${bookId}`)
      setBooks((prev) => prev.filter((book) => String(book.id) !== String(bookId)))
      resetForm()
      setSuccess('Livro excluído com sucesso.')
    } catch (err) {
      console.error(err)
      setError('Não foi possível excluir o livro. Tente novamente.')
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (!title || !author || !category) {
      setError('Preencha título, autor e categoria.')
      setSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('author', author)
      formData.append('category', category)
      formData.append('summary', summary)

      if (editingBook) {
        if (!coverImage && !editingBook.cover_url && !editingBook.full_cover_url) {
          setError('Selecione uma imagem da capa para atualizar o livro.')
          setSubmitting(false)
          return
        }

        if (coverImage) {
          formData.append('coverImage', coverImage)
        } else if (editingBook.cover_url || editingBook.full_cover_url) {
          const existingCoverFilename =
            editingBook.full_cover_url?.split('/').pop() || editingBook.cover_url?.split('/').pop() || ''
          formData.append('coverUrlMock', existingCoverFilename)
        }

        const response = await api.patch(`/users/me/books/${editingBook.id}`, formData)
        const updatedBook = response.data as Book

        if (summary && summaryId) {
          const summaryForm = new FormData()
          summaryForm.append('content', summary)
          await api.patch(`/summaries/${summaryId}`, summaryForm)
        } else if (summary && !summaryId && updatedBook.slug) {
          const summaryForm = new FormData()
          summaryForm.append('title', title)
          summaryForm.append('author', author)
          summaryForm.append('category', category)
          summaryForm.append('content', summary)
          summaryForm.append('slug', updatedBook.slug)
          summaryForm.append('coverUrlMock', updatedBook.cover_url ?? '')
          await api.post('/summaries', summaryForm)
        }

        setBooks((prev) => prev.map((book) => (String(book.id) === String(editingBook.id) ? updatedBook : book)))
        setSuccess('Livro atualizado com sucesso.')
      } else {
        if (!coverImage) {
          setError('Selecione uma imagem da capa para criar um livro.')
          setSubmitting(false)
          return
        }

        formData.append('coverImage', coverImage)

        const response = await api.post('/users/me/books', formData)
        const createdBook = response.data as Book

        if (summary && createdBook.slug) {
          const summaryForm = new FormData()
          summaryForm.append('title', title)
          summaryForm.append('author', author)
          summaryForm.append('category', category)
          summaryForm.append('content', summary)
          summaryForm.append('slug', createdBook.slug)
          summaryForm.append('coverUrlMock', createdBook.cover_url ?? '')
          await api.post('/summaries', summaryForm)
        }

        setBooks((prev) => [createdBook, ...prev])
        setSuccess('Livro criado com sucesso e enviado para análise.')
      }

      resetForm()
    } catch (err: unknown) {
      console.error(err)
      const errorData = typeof err === 'object' && err !== null && 'response' in err ? (err as any).response?.data?.error : null
      const message = typeof errorData === 'string' ? errorData : null
      setError(message || 'Ocorreu um erro ao salvar o livro.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCoverImage(event.target.files[0])
    }
  }

  if (!signed) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Meus Livros</h1>
          <p className="text-slate-600 dark:text-slate-400">Faça login para criar e gerenciar seus livros.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Meus Livros</h1>
          <p className="text-slate-500 dark:text-slate-400">Crie, edite ou exclua livros que você enviou.</p>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-300">{pendingCount} livro{pendingCount === 1 ? '' : 's'} está{pendingCount === 1 ? '' : 'o'} pendente de aprovação e ainda não aparece na área pública.</p>
          )}
        </div>
      </div>
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{editingBook ? 'Editar livro' : 'Novo livro'}</h2>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {editingCoverUrl && (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <img
                  src={editingCoverUrl}
                  alt={`Capa de ${editingBook?.title}`}
                  className="h-56 w-full object-cover"
                />
              </div>
            )}
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
            <input
              type="text"
              placeholder="Autor"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
            <input
              type="text"
              placeholder="Categoria"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
            <textarea
              placeholder="Escreva um resumo opcional do livro"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={4}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
            <label className="block rounded-3xl border border-slate-300 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <span className="text-sm font-medium">Capa do livro</span>
              <span className="mt-3 block text-sm text-slate-500 dark:text-slate-400">JPEG ou PNG</span>
              <input
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleCoverChange}
                className="mt-4 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 dark:text-slate-200 dark:file:bg-slate-100 dark:file:text-slate-950"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {submitting ? 'Salvando...' : editingBook ? 'Atualizar livro' : 'Criar livro'}
              </button>
              {editingBook && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar edição
                </button>
              )}
            </div>
            {success && <p className="text-sm text-emerald-600 dark:text-emerald-300">{success}</p>}
            {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
          </form>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Seus livros</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Visualize e gerencie seus envios.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'ALL' | 'PENDING' | 'COMPLETED')}
                  className="rounded-full border border-slate-300 bg-transparent px-3 py-2 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                >
                  <option value="ALL">Todos</option>
                  <option value="PENDING">Pendente</option>
                  <option value="COMPLETED">Concluído</option>
                </select>
              </label>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {filteredBooks.length} livros
              </span>
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-slate-600 dark:text-slate-400">Carregando seus livros...</p>
          ) : books.length === 0 ? (
            <p className="mt-6 text-slate-600 dark:text-slate-400">Você ainda não tem livros cadastrados.</p>
          ) : filteredBooks.length === 0 ? (
            <p className="mt-6 text-slate-600 dark:text-slate-400">Nenhum livro encontrado para esse status.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredBooks.map((book) => (
                <article key={book.id} className="rounded-4xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                        {book.full_cover_url || book.cover_url ? (
                          <img
                            src={book.full_cover_url || book.cover_url}
                            alt={`Capa de ${book.title}`}
                            className="h-28 w-20 flex-none rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-28 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                            Sem capa
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{book.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{book.author} • {book.category}</p>
                          <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {book.status ?? 'PENDING'}
                          </span>
                        </div>
                      </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/meus-livros/${book.id}`}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        Ver detalhes
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleEdit(book)}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(book.id)}
                        className="rounded-full border border-rose-500 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500 dark:bg-slate-950 dark:text-rose-300 dark:hover:bg-rose-900/50"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
    </section>
  )
}

export default MyBooksPage
