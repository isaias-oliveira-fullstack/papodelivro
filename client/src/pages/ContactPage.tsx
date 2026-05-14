import { useAuth } from '../contexts/AuthContext'
import SubmitContact from '@/components/SubmitContact'

const ContactPage = () => {
  const { signed } = useAuth()

  return (
    <section className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm shadow-slate-200/50 transition dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-none sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Contato</p>
          <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Fale conosco</h1>
          <p className="max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300">
            Se você tiver dúvidas, sugestões ou quiser nos contar sobre sua experiência de leitura, envie uma mensagem e nossa equipe entrará em contato.
          </p>
        </div>

        <div className="space-y-5 rounded-4xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950 sm:p-8">
          <SubmitContact  />
        </div>
      </div>

      {!signed && (
        <div className="mt-8 rounded-4xl border border-dashed border-slate-300 bg-white/80 p-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
          <p>Faça login para acompanhar mais de perto seus envios e histórico neste site.</p>
        </div>
      )}
    </section>
  )
}

export default ContactPage
