import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface UserMessage {
  id: number | string
  subject: string
  message: string
  reply?: string | null
  repliedAt?: string | null
  createdAt: string
  isRead?: boolean
}

const MyMessagesPage = () => {
  const navigate = useNavigate()
  const { loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<UserMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/users/me/messages')
        setMessages(response.data as UserMessage[])
        setError(null)
      } catch (err) {
        console.error('Erro ao carregar mensagens do usuário:', err)
        setError('Não foi possível carregar suas mensagens. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      loadMessages()
    }
  }, [authLoading])

  const pendingMessages = messages.filter((msg) => !msg.reply)
  const answeredMessages = messages.filter((msg) => !!msg.reply)

  const handleNewSuggestion = () => {
    navigate('/proposta-resumo')
  }

  if (authLoading || isLoading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-10">
        <p className="text-slate-600 dark:text-slate-400">Carregando suas mensagens...</p>
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Minhas Mensagens</h1>
            <p className="text-slate-600 dark:text-slate-400">Veja as sugestões que você enviou e as respostas dos administradores.</p>
          </div>
          <button
            type="button"
            onClick={handleNewSuggestion}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Enviar outra sugestão
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-slate-600 dark:text-slate-400">Você ainda não enviou nenhuma sugestão de livro.</p>
        </div>
      ) : (
        <div className="space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Sugestões aguardando resposta</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Acompanhe os envios que ainda não receberam retorno do administrador.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {pendingMessages.length} pendente{pendingMessages.length === 1 ? '' : 's'}
              </span>
            </div>
            {pendingMessages.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <p className="text-slate-600 dark:text-slate-400">Nenhuma sugestão está aguardando resposta no momento.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingMessages.map((msg) => (
                  <article key={msg.id} className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{msg.subject}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Enviada em {new Date(msg.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Aguardando resposta</span>
                    </div>

                    <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      <p>{msg.message}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Sugestões já respondidas</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Veja os retornos que os administradores enviaram para suas sugestões.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                {answeredMessages.length} respondida{answeredMessages.length === 1 ? '' : 's'}
              </span>
            </div>
            {answeredMessages.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <p className="text-slate-600 dark:text-slate-400">Ainda não há respostas para suas sugestões.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {answeredMessages.map((msg) => (
                  <article key={msg.id} className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{msg.subject}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Enviada em {new Date(msg.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">Respondida</span>
                    </div>

                    <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      <p>{msg.message}</p>
                    </div>

                    <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-slate-900 dark:border-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-200">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">Resposta do admin</p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{msg.reply}</p>
                      {msg.repliedAt && (
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Respondida em {new Date(msg.repliedAt).toLocaleDateString('pt-BR')}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

export default MyMessagesPage
