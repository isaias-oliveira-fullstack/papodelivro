import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const SubmitForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!validateEmail(email)) {
      setError('Informe um e-mail válido.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setMessage('Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.')
      setEmail('')
    } catch (err) {
      console.error(err)
      setError('Não foi possível enviar a solicitação. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="form-control h-12 w-full border-2 border-white bg-transparent text-white px-5 placeholder-white rounded-md"
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-12 bg-white text-black text-sm px-7 font-semibold rounded-md hover:bg-black hover:text-white transition-all cursor-pointer"
          >
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </button>
          <p className="text-slate-100! text-sm">
          Lembrou da senha?{' '}
          <Link 
            to="/login" 
            className="underline font-semibold hover:text-gray-300 transition">
            Voltar ao login
          </Link>
        </p>
        </div>
          {message && <p className="text-slate-100! text-sm">{message}</p>}
          {error && <p className="text-slate-100! text-sm">{error}</p>}
        </form>
  );
};

export default SubmitForgotPassword;
