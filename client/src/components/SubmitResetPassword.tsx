import { FormEvent, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'

const SubmitResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!token) {
      setError('Token inválido. Verifique o link enviado por e-mail.')
      return
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('A confirmação deve ser igual à nova senha.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setMessage('Senha redefinida com sucesso! Agora você pode entrar com a nova senha.')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error(err)
      setError('Não foi possível redefinir a senha. O link pode estar expirado ou inválido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
          <input
              id="new-password"
              type={showPassword.password ? "text" : "password"}
              placeholder="Nova senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="form-control h-12 w-full border-2 border-white bg-transparent text-white px-5 placeholder-white rounded-md"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                password: !prev.password,
              }))
            }
            aria-label="Mostrar/Ocultar senha"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            {showPassword.password ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
          </div>
          <div className="relative">
          <input
              id="confirm-password"
              type={showPassword.confirmPassword ? "text" : "password"}
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="form-control h-12 w-full border-2 border-white bg-transparent text-white px-5 placeholder-white rounded-md"
              />
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                confirmPassword: !prev.confirmPassword,
              }))
            }
            aria-label="Mostrar/Ocultar senha"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            {showPassword.confirmPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
          </div>
          </div>
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-12 bg-white text-black text-sm px-7 font-semibold rounded-md hover:bg-black hover:text-white transition-all cursor-pointer"
          >
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>

          <p className="text-slate-100! text-sm">
          Voltar para{' '}
          <Link to="/login" className="underline font-semibold hover:text-gray-300 transition">
            página de login
          </Link>
        </p>
        </div>
          {message && <p className="text-slate-100! text-sm">{message}</p>}
          {error && <p className="text-slate-100! text-sm">{error}</p>}
        </form>
  );
};

export default SubmitResetPassword;
