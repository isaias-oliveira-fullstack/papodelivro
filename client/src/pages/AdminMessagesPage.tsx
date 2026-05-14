import { useState, useEffect, useCallback, FormEvent } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface Message {
  id: number | string
  name: string
  email: string
  subject: string
  message: string
  user_id?: number | null
  createdAt: string
  is_read?: boolean
}

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { loading: authLoading } = useAuth()

  const promptMessages = messages.filter((message) => message.user_id)
  const contactMessages = messages.filter((message) => !message.user_id)

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/admin/messages', { timeout: 15000 })
      setMessages(response.data as Message[])
      setError(null)
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'ECONNABORTED') {
        setError('O servidor demorou muito para responder. Tente recarregar a página.')
      } else {
        setError('Não foi possível carregar as mensagens. Tente novamente mais tarde.')
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      fetchMessages()
    }
  }, [authLoading, fetchMessages])

  const handleDelete = async (messageId: number | string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta mensagem permanentemente?')) {
      return
    }

    try {
      await api.delete(`/admin/messages/${messageId}`)
      fetchMessages()
    } catch (err) {
      alert('Falha ao deletar a mensagem.')
      console.error(err)
    }
  }

  const handleStartReply = (message: Message) => {
    setReplyingMessage(message)
  }

  const handleSendReply = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!replyingMessage) return

    setIsSending(true)
    try {
      await api.post(`/admin/messages/${replyingMessage.id}/reply`, { replyText })
      alert('Resposta enviada com sucesso!')
      fetchMessages()
      setReplyingMessage(null)
      setReplyText('')
    } catch (err) {
      alert('Falha ao enviar a resposta.')
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <p className="text-slate-600 dark:text-slate-400">Carregando mensagens...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Caixa de Entrada</h1>
          <p className="text-slate-600 dark:text-slate-400">Gerencie mensagens recebidas e responda diretamente aos usuários.</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Sugestões de Usuários</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Veja e responda às sugestões enviadas por usuários autenticados.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {promptMessages.length} sugestão{promptMessages.length === 1 ? '' : 'es'}
              </span>
            </div>

            {promptMessages.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <p className="text-slate-600 dark:text-slate-400">Nenhuma sugestão de usuário encontrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {promptMessages.map((msg) => (
                  <article
                    key={msg.id}
                    className={`rounded-[2rem] border p-6 shadow-sm transition dark:border-slate-700 ${msg.is_read ? 'border-slate-200 bg-white/90 dark:bg-slate-900' : 'border-slate-300 bg-slate-50 dark:bg-slate-950'}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                      <div className="space-y-2 text-slate-950 dark:text-white">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Usuário: {msg.name} ({msg.email})</p>
                        <p className="text-lg font-semibold">{msg.subject}</p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(msg.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="mt-4 text-slate-700 dark:text-slate-300">
                      <p>{msg.message}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-slate-300 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-600 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                        onClick={() => handleStartReply(msg)}
                      >
                        Responder
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200"
                        onClick={() => handleDelete(msg.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Mensagens de Contato</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Mensagens recebidas diretamente pela página de contato.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {contactMessages.length} mensagem{contactMessages.length === 1 ? '' : 'ns'}
              </span>
            </div>
            {contactMessages.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <p className="text-slate-600 dark:text-slate-400">Nenhuma mensagem de contato encontrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((msg) => (
                  <article
                    key={msg.id}
                    className={`rounded-[2rem] border p-6 shadow-sm transition dark:border-slate-700 ${msg.is_read ? 'border-slate-200 bg-white/90 dark:bg-slate-900' : 'border-slate-300 bg-slate-50 dark:bg-slate-950'}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                      <div className="space-y-2 text-slate-950 dark:text-white">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Remetente: {msg.name} ({msg.email})</p>
                        <p className="text-lg font-semibold">{msg.subject}</p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(msg.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="mt-4 text-slate-700 dark:text-slate-300">
                      <p>{msg.message}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-slate-300 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-600 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                        onClick={() => handleStartReply(msg)}
                      >
                        Responder
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200"
                        onClick={() => handleDelete(msg.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {replyingMessage && (
          <aside className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Respondendo a {replyingMessage.name}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Assunto: {replyingMessage.subject}</p>
            <form className="mt-6 space-y-4" onSubmit={handleSendReply}>
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                rows={8}
                placeholder="Escreva sua resposta aqui..."
                required
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setReplyingMessage(null)}
                  disabled={isSending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                  disabled={isSending}
                >
                  {isSending ? 'Enviando...' : 'Enviar Resposta'}
                </button>
              </div>
            </form>
          </aside>
        )}
      </div>
    </section>
  )
}

export default AdminMessagesPage
