import { useEffect, useState, FormEvent } from "react";
import api from "../services/api";

const SubmitContact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    setFeedback(null);

    try {
      await api.post("/contact", { name, email, subject, message });
      setFeedback("Sua mensagem foi enviada com sucesso!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      console.error(err);
      setFeedback("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };
  
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [feedback]);
  

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="w-full">
          <div className="mt-5">
            <input
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome"
              required
              className="w-full rounded-md py-3.5 px-6 border-2 border-gray-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="mt-5">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="E-mail"
              required
              className="w-full rounded-md py-3.5 px-6 border-2 border-gray-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mt-5">
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Assunto"
            required
            className="w-full rounded-md py-3.5 px-6 border-2 border-gray-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="w-full">
        <div className="mt-5">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            placeholder="Mensagem"
            required
            className="w-full rounded-md py-3.5 px-6 border-2 border-gray-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="w-full">
        <div className="mt-5">
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 cursor-pointer"
          >
            {isSending ? "Enviando..." : "Enviar mensagem"}
          </button>
        </div>
      </div>
      {feedback && (
        <div className="w-full">
          <div className="mt-5">
            <p className="text-sm text-emerald-600 dark:text-emerald-300">
              {feedback}
            </p>
          </div>
        </div>
      )}
    </form>
  );
};

export default SubmitContact;
