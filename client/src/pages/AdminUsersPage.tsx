import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import type { User } from '../types'

interface AdminUserItem extends User {
  id: number | string
}

const AdminUsersPage = () => {
  const { user, updateUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [editingUserId, setEditingUserId] = useState<number | string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState<'admin' | 'user' | string>('user')
  const [editPassword, setEditPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get('/admin/users')
        setUsers(response.data)
      } catch (err) {
        setError('Não foi possível carregar os usuários.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const startEdit = (currentUser: AdminUserItem) => {
    setEditingUserId(currentUser.id)
    setEditName(currentUser.name)
    setEditEmail(currentUser.email ?? '')
    setEditRole(currentUser.role ?? 'user')
    setEditPassword('')
    setMessage(null)
    setError(null)
  }

  const cancelEdit = () => {
    setEditingUserId(null)
    setMessage(null)
    setError(null)
  }

  const saveUser = async (userId: number | string) => {
    setError(null)
    setMessage(null)

    try {
      const payload: Record<string, string> = {
        name: editName,
        email: editEmail,
        role: editRole,
      }

      if (editPassword) {
        payload.password = editPassword
      }

      const response = await api.patch(`/admin/users/${userId}`, payload)

      const updatedUser = response.data.user
      setUsers((prev) => prev.map((item) => (String(item.id) === String(userId) ? { ...item, ...updatedUser } : item)))

      if (user?.id === userId) {
        updateUser(updatedUser)
      }

      setEditingUserId(null)
      setMessage('Usuário atualizado com sucesso.')
    } catch (err: unknown) {
      const errorData =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as any).response?.data?.error
          : null
      const message = typeof errorData === 'string' ? errorData : 'Não foi possível atualizar o usuário.'
      setError(message)
    }
  }

  const deleteUser = async (userId: number | string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este usuário?')) {
      return
    }

    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers((prev) => prev.filter((item) => String(item.id) !== String(userId)))
      setMessage('Usuário excluído com sucesso.')

      if (user?.id === userId) {
        signOut()
        navigate('/')
        return
      }
    } catch (err) {
      setError('Não foi possível excluir o usuário.')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <p className="text-slate-600 dark:text-slate-400">Carregando usuários...</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Gerenciar Usuários</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Edite ou exclua usuários cadastrados.</p>
        </div>
      </div>

      {message && <div className="rounded-3xl bg-emerald-100 px-5 py-4 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">{message}</div>}
      {error && <div className="rounded-3xl bg-rose-100 px-5 py-4 text-sm text-rose-800 dark:bg-rose-900/20 dark:text-rose-200">{error}</div>}

      {users.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <p>Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((item) => (
            <div key={item.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">ID: {item.id}</p>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{item.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.email}</p>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {item.role}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteUser(item.id)}
                    className="inline-flex items-center justify-center rounded-full border border-rose-500 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500 dark:bg-slate-950 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {String(editingUserId) === String(item.id) && (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-slate-700 dark:text-slate-200">
                      Nome
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </label>
                    <label className="block text-sm text-slate-700 dark:text-slate-200">
                      E-mail
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </label>
                    <label className="block text-sm text-slate-700 dark:text-slate-200">
                      Papel
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </label>
                    <label className="block text-sm text-slate-700 dark:text-slate-200">
                      Senha
                      <input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Deixe em branco para manter"
                        className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </label>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => saveUser(item.id)}
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      Salvar alterações
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminUsersPage;
