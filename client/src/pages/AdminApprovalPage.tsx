import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface AdminSummary {
  id: number | string
  book?: {
    id?: number | string
    title?: string
    author?: string
    category?: string
    cover_url?: string
    full_cover_url?: string
    slug?: string
  }
  slug?: string
  user?: {
    name: string
    email: string
  }
  status?: string
  content?: string
}

interface AdminBook {
  id: number | string
  title?: string
  author?: string
  category?: string
  slug?: string
  cover_url?: string
  full_cover_url?: string
  status?: string
  user?: {
    id?: number | string
    name?: string
    email?: string
  }
  created_at?: string
}

const AdminApprovalPage = () => {
  const [summaries, setSummaries] = useState<AdminSummary[]>([])
  const [books, setBooks] = useState<AdminBook[]>([])
  const [selectedSummaryId, setSelectedSummaryId] = useState<number | string | null>(null)
  const [activeTab, setActiveTab] = useState<'BOOKS' | 'SUMMARIES'>('BOOKS')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const handleEdit = (summary: AdminSummary) => {
    navigate('/enviar-resumo', {
      state: {
        book: summary.book,
        summary,
      },
    })
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summariesResponse, booksResponse] = await Promise.all([
          api.get('/admin/all-summaries'),
          api.get('/admin/books'),
        ])

        setSummaries(summariesResponse.data as AdminSummary[])
        setBooks(booksResponse.data as AdminBook[])
      } catch (err) {
        setError('Não foi possível buscar resumos e livros.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadData()
    }
  }, [authLoading])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCoverImage(event.target.files[0])
    }
  }

  const pendingSummaries = summaries.filter((summary) => summary.status === 'PENDING')
  const approvedSummaries = summaries.filter((summary) => summary.status === 'COMPLETED')
  const rejectedSummaries = summaries.filter((summary) => summary.status === 'REJECTED')
  const pendingBooks = books.filter((book) => book.status === 'PENDING')
  const approvedBooks = books.filter((book) => book.status === 'COMPLETED')
  const rejectedBooks = books.filter((book) => book.status === 'REJECTED')
  const selectedSummary = summaries.find((item) => String(item.id) === String(selectedSummaryId))

  const handleReject = async (summaryId: number | string) => {
    if (!window.confirm('Tem certeza de que deseja rejeitar este resumo?')) return

    try {
      await api.post(`/admin/summaries/${summaryId}/reject`)
      setSummaries((prev) =>
        prev.map((item) =>
          String(item.id) === String(summaryId) ? { ...item, status: 'REJECTED' } : item
        )
      )
      alert('Resumo rejeitado com sucesso.')
    } catch (err) {
      console.error('Erro ao rejeitar resumo:', err)
      setError('Não foi possível rejeitar o resumo. Tente novamente.')
    }
  }

  const handleRejectBook = async (bookId: number | string) => {
    if (!window.confirm('Tem certeza de que deseja rejeitar este livro?')) return

    try {
      const response = await api.patch(`/admin/books/${bookId}`, { status: 'REJECTED' })
      setBooks((prev) =>
        prev.map((item) =>
          String(item.id) === String(bookId) ? (response.data as AdminBook) : item
        )
      )
      alert('Livro rejeitado com sucesso.')
    } catch (err) {
      console.error('Erro ao rejeitar livro:', err)
      setError('Não foi possível rejeitar o livro. Tente novamente.')
    }
  }

  const handleReapproveBook = async (bookId: number | string) => {
    try {
      const response = await api.patch(`/admin/books/${bookId}`, { status: 'COMPLETED' })
      setBooks((prev) =>
        prev.map((item) =>
          String(item.id) === String(bookId) ? (response.data as AdminBook) : item
        )
      )
      alert('Livro reapropriado com sucesso.')
    } catch (err) {
      console.error('Erro ao reaprovar livro:', err)
      setError('Não foi possível reaprovar o livro. Tente novamente.')
    }
  }

  const handleDelete = async (summaryId: number | string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este resumo permanentemente?')) return

    try {
      await api.delete(`/admin/summaries/${summaryId}`)
      setSummaries((prev) => prev.filter((item) => String(item.id) !== String(summaryId)))
      alert('Resumo excluído com sucesso.')
    } catch (err) {
      console.error('Erro ao excluir resumo:', err)
      setError('Não foi possível excluir o resumo. Tente novamente.')
    }
  }

  const handleApprove = async (summaryId: number | string) => {
    try {
      await api.post(`/admin/summaries/${summaryId}/approve`)
      setSummaries((prev) =>
        prev.map((item) =>
          String(item.id) === String(summaryId) ? { ...item, status: 'COMPLETED' } : item
        )
      )
      alert('Resumo aprovado com sucesso.')
    } catch (err) {
      console.error('Erro ao aprovar resumo:', err)
      setError('Não foi possível aprovar o resumo. Tente novamente.')
    }
  }

  const handleApproveBook = async (bookId: number | string) => {
    try {
      const response = await api.patch(`/admin/books/${bookId}`, { status: 'COMPLETED' })
      setBooks((prev) =>
        prev.map((item) =>
          String(item.id) === String(bookId) ? (response.data as AdminBook) : item
        )
      )
      alert('Livro aprovado com sucesso.')
    } catch (err) {
      console.error('Erro ao aprovar livro:', err)
      setError('Não foi possível aprovar o livro. Tente novamente.')
    }
  }

  const handleDeleteBook = async (bookId: number | string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este livro?')) return

    try {
      await api.delete(`/admin/books/${bookId}`)
      setBooks((prev) => prev.filter((item) => String(item.id) !== String(bookId)))
      alert('Livro excluído com sucesso.')
    } catch (err) {
      console.error('Erro ao excluir livro:', err)
      setError('Não foi possível excluir o livro. Tente novamente.')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedSummaryId) {
      setError('Selecione um resumo antes de aprovar.')
      return
    }

    setSaving(true)
    setError(null)

    const summary = summaries.find((item) => String(item.id) === String(selectedSummaryId))
    const bookId = summary?.book?.id

    try {
      await api.post(`/admin/summaries/${selectedSummaryId}/approve`)

      if (coverImage && bookId) {
        const coverFormData = new FormData()
        coverFormData.append('coverImage', coverImage)
        await api.patch(`/admin/books/${bookId}/cover`, coverFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      setSelectedSummaryId(null)
      setCoverImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      alert(selectedSummary?.status === 'REJECTED' ? 'Resumo rejeitado aprovado com sucesso.' : 'Resumo aprovado com sucesso.')
      setSummaries((prev) =>
        prev.map((item) =>
          String(item.id) === String(selectedSummaryId) ? { ...item, status: 'COMPLETED' } : item
        )
      )
    } catch (err) {
      setError('Falha ao aprovar o resumo.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <p className="text-slate-600 dark:text-slate-400">Carregando resumos para aprovação...</p>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Aprovação de Resumos e Livros</h1>
          <p className="text-slate-600 dark:text-slate-400">Revise e aprove conteúdos enviados pelos usuários antes de liberá-los publicamente.</p>
        </div>
        {error && <p className="mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('BOOKS')}
              className={`rounded-full px-4 py-2 transition ${activeTab === 'BOOKS' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Livros
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SUMMARIES')}
              className={`rounded-full px-4 py-2 transition ${activeTab === 'SUMMARIES' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Resumos
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Mostra apenas o conteúdo da aba selecionada.</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <section className={`rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8 ${activeTab !== 'BOOKS' ? 'hidden' : ''}`}>
          <h2 className="mb-5 text-2xl font-semibold text-slate-950 dark:text-white">Livros Pendentes</h2>
          {pendingBooks.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">Não há livros pendentes de aprovação no momento.</p>
          ) : (
            <ul className="space-y-4">
              {pendingBooks.map((book) => (
                <li key={book.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
                  <div className="grid gap-4 md:grid-cols-[96px_1fr]">
                    <div className="h-24 w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                      {book.full_cover_url ? (
                        <img src={book.full_cover_url} alt={`Capa de ${book.title ?? 'livro'}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
                          Sem capa disponível
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between gap-4">
                      <div className="space-y-2 text-slate-950 dark:text-slate-100">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <strong className="block text-base">{book.title ?? 'Título desconhecido'}</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{book.author ?? 'Autor desconhecido'}</p>
                          </div>
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {book.category ?? 'Categoria desconhecida'}
                          </span>
                        </div>
                        <small className="text-slate-500 dark:text-slate-400">Enviado por {book.user?.name ?? 'Usuário desconhecido'}</small>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleApproveBook(book.id)}
                          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                          Aprovar livro
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(book.id)}
                          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={`rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8 ${activeTab !== 'SUMMARIES' ? 'hidden' : ''}`}>
          <h2 className="mb-5 text-2xl font-semibold text-slate-950 dark:text-white">Resumos Pendentes</h2>
          {pendingSummaries.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">Não há resumos para aprovação no momento.</p>
          ) : (
            <ul className="space-y-4">
              {pendingSummaries.map((summary) => (
                <li key={summary.id} className="rounded-4xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
                  <div className="grid gap-4 md:grid-cols-[96px_1fr]">
                    <div className="h-24 w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                      {summary.book?.full_cover_url ? (
                        <img
                          src={summary.book.full_cover_url}
                          alt={`Capa de ${summary.book?.title ?? 'livro'}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
                          Sem capa disponível
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between gap-4">
                      <div className="space-y-2 text-slate-950 dark:text-slate-100">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <strong className="block text-base">{summary.book?.title ?? 'Título desconhecido'}</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{summary.book?.author ?? 'Autor desconhecido'}</p>
                          </div>
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {summary.book?.category ?? 'Categoria desconhecida'}
                          </span>
                        </div>
                        <small className="text-slate-500 dark:text-slate-400">Enviado por {summary.user?.name ?? 'Usuário desconhecido'}</small>
                      </div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                        <button
                          type="button"
                          onClick={() => handleEdit(summary)}
                          className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 md:w-auto"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(summary.id)}
                          className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 md:w-auto"
                        >
                          Rejeitar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(summary.id)}
                          className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 md:w-auto"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-8 ${activeTab !== 'SUMMARIES' ? 'hidden' : ''}`}>
          <h2 className="mb-5 text-2xl font-semibold text-slate-950 dark:text-white">Marcar como Publicado</h2>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="summarySelector">
                    Resumo
                  </label>
                  <select
                    id="summarySelector"
                    value={selectedSummaryId ?? ''}
                    onChange={(event) => setSelectedSummaryId(event.target.value ? event.target.value : null)}
                    className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                  >
                    <option value="">Selecione um resumo pendente ou rejeitado</option>
                    {pendingSummaries.length > 0 && (
                      <optgroup label="Pendentes">
                        {pendingSummaries.map((summary) => (
                          <option key={`pending-${summary.id}`} value={summary.id}>
                            {summary.book?.title ?? 'Título desconhecido'} — {summary.book?.author ?? 'Autor desconhecido'}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {rejectedSummaries.length > 0 && (
                      <optgroup label="Rejeitados">
                        {rejectedSummaries.map((summary) => (
                          <option key={`rejected-${summary.id}`} value={summary.id}>
                            {summary.book?.title ?? 'Título desconhecido'} — {summary.book?.author ?? 'Autor desconhecido'}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {selectedSummary && (
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Resumo selecionado</p>
                    <strong className="block text-lg text-slate-950 dark:text-white">{selectedSummary.book?.title ?? 'Título desconhecido'}</strong>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedSummary.book?.author ?? 'Autor desconhecido'}</p>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {selectedSummary.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {saving
                    ? 'Salvando...'
                    : selectedSummary?.status === 'REJECTED'
                    ? 'Reaprovar resumo'
                    : 'Aprovar resumo'}
                </button>
              </div>

              <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="coverImage">
                  Imagem de Capa (opcional)
                </label>
                <input
                  ref={fileInputRef}
                  id="coverImage"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                />
                {coverImage && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">Arquivo selecionado: {coverImage.name}</p>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>

      <section className={`rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8 ${activeTab !== 'SUMMARIES' ? 'hidden' : ''}`}>
        <h2 className="mb-5 text-2xl font-semibold text-slate-950 dark:text-white">Resumos Aprovados</h2>
        {approvedSummaries.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">Nenhum resumo aprovado encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {approvedSummaries.map((summary) => (
              <li key={summary.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
                <div className="grid gap-4 md:grid-cols-[96px_1fr]">
                  <div className="h-24 w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                    {summary.book?.full_cover_url ? (
                      <img
                        src={summary.book.full_cover_url}
                        alt={`Capa de ${summary.book?.title ?? 'livro'}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
                        Sem capa disponível
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-2 text-slate-950 dark:text-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <strong className="block text-base">{summary.book?.title ?? 'Título desconhecido'}</strong>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{summary.book?.author ?? 'Autor desconhecido'}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {summary.book?.category ?? 'Categoria desconhecida'}
                        </span>
                      </div>
                      <small className="text-slate-500 dark:text-slate-400">Enviado por {summary.user?.name ?? 'Usuário desconhecido'}</small>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleEdit(summary)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 md:w-auto"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(summary.id)}
                        className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 md:w-auto"
                      >
                        Rejeitar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(summary.id)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:w-auto"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8 ${activeTab !== 'SUMMARIES' ? 'hidden' : ''}`}>
        <h2 className="mb-5 text-2xl font-semibold text-slate-950 dark:text-white">Resumos Rejeitados</h2>
        {rejectedSummaries.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">Nenhum resumo rejeitado até o momento.</p>
        ) : (
          <ul className="space-y-4">
            {rejectedSummaries.map((summary) => (
              <li key={summary.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
                <div className="grid gap-4 md:grid-cols-[96px_1fr]">
                  <div className="h-24 w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                    {summary.book?.full_cover_url ? (
                      <img
                        src={summary.book.full_cover_url}
                        alt={`Capa de ${summary.book?.title ?? 'livro'}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
                        Sem capa disponível
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-2 text-slate-950 dark:text-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <strong className="block text-base">{summary.book?.title ?? 'Título desconhecido'}</strong>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{summary.book?.author ?? 'Autor desconhecido'}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {summary.book?.category ?? 'Categoria desconhecida'}
                        </span>
                      </div>
                      <small className="text-slate-500 dark:text-slate-400">Enviado por {summary.user?.name ?? 'Usuário desconhecido'}</small>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleEdit(summary)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 md:w-auto"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(summary.id)}
                        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 md:w-auto"
                      >
                        Reaprovar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(summary.id)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:w-auto"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8 ${activeTab !== 'BOOKS' ? 'hidden' : ''}`}>
        <h2 className="mb-5 text-2xl font-semibold text-slate-950 dark:text-white">Livros Aprovados</h2>
        {approvedBooks.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">Nenhum livro aprovado encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {approvedBooks.map((book) => (
              <li key={book.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
                <div className="grid gap-4 md:grid-cols-[96px_1fr]">
                  <div className="h-24 w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                    {book.full_cover_url ? (
                      <img
                        src={book.full_cover_url}
                        alt={`Capa de ${book.title ?? 'livro'}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
                        Sem capa disponível
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-2 text-slate-950 dark:text-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <strong className="block text-base">{book.title ?? 'Título desconhecido'}</strong>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{book.author ?? 'Autor desconhecido'}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {book.category ?? 'Categoria desconhecida'}
                        </span>
                      </div>
                      <small className="text-slate-500 dark:text-slate-400">Enviado por {book.user?.name ?? 'Usuário desconhecido'}</small>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleRejectBook(book.id)}
                        className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 md:w-auto"
                      >
                        Rejeitar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book.id)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:w-auto"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8 ${activeTab !== 'BOOKS' ? 'hidden' : ''}`}>
        <h2 className="mb-5 text-2xl font-semibold text-slate-950 dark:text-white">Livros Rejeitados</h2>
        {rejectedBooks.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">Nenhum livro rejeitado até o momento.</p>
        ) : (
          <ul className="space-y-4">
            {rejectedBooks.map((book) => (
              <li key={book.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
                <div className="grid gap-4 md:grid-cols-[96px_1fr]">
                  <div className="h-24 w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                    {book.full_cover_url ? (
                      <img
                        src={book.full_cover_url}
                        alt={`Capa de ${book.title ?? 'livro'}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
                        Sem capa disponível
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-2 text-slate-950 dark:text-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <strong className="block text-base">{book.title ?? 'Título desconhecido'}</strong>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{book.author ?? 'Autor desconhecido'}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {book.category ?? 'Categoria desconhecida'}
                        </span>
                      </div>
                      <small className="text-slate-500 dark:text-slate-400">Enviado por {book.user?.name ?? 'Usuário desconhecido'}</small>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleReapproveBook(book.id)}
                        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 md:w-auto"
                      >
                        Reaprovar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book.id)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:w-auto"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

export default AdminApprovalPage
