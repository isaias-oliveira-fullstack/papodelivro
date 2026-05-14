import { useEffect, useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const ProfilePage = () => {
  const { signed, user, signOut, updateUser } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email ?? '')
    }
  }, [user])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const payload: Record<string, string> = { name, email }
      if (password) {
        payload.password = password
      }

      const response = await api.patch('/users/me', payload)
      updateUser(response.data.user)
      setMessage('Dados atualizados com sucesso.')
      setPassword('')
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as any).response?.data?.error
          : 'Não foi possível atualizar o perfil.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await api.delete('/users/me')
      signOut()
      navigate('/')
    } catch (err) {
      setError('Não foi possível excluir sua conta. Tente novamente.')
      console.error(err)
    }
  }

  if (!signed) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Meu Perfil</h1>
          <p className="text-slate-600 dark:text-slate-400">Faça login para ver e editar seus dados.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Meu Perfil</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Atualize seus dados ou exclua sua conta.</p>
        </div>
      </div>

      {message && <div className="rounded-3xl bg-emerald-100 px-5 py-4 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">{message}</div>}
      {error && <div className="rounded-3xl bg-rose-100 px-5 py-4 text-sm text-rose-800 dark:bg-rose-900/20 dark:text-rose-200">{error}</div>}

      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Nova senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe em branco para manter a senha atual"
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Atualizar perfil
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-full border border-rose-500 bg-white px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500 dark:bg-slate-950 dark:text-rose-300 dark:hover:bg-rose-900/10"
            >
              Excluir minha conta
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default ProfilePage;
