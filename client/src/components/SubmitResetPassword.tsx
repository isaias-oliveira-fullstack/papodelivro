import { FormEvent, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

const SubmitResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Token inválido. Verifique o link enviado por e-mail.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("A confirmação deve ser igual à nova senha.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setMessage(
        "Senha redefinida com sucesso! Agora você pode entrar com a nova senha.",
      );
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(
        "Não foi possível redefinir a senha. O link pode estar expirado ou inválido.",
      );
    } finally {
      setLoading(false);
    }
  };

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
            className="form-control h-12 w-full border-2 border-slate-100 bg-transparent text-slate-100 px-5 placeholder:text-slate-300 dark:placeholder:text-slate-400 rounded-md"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <i
              className={`relative lni lni-eye text-2xl text-slate-100 flex items-center justify-center
    ${
      !showPassword.password
        ? "after:content-[''] after:absolute after:w-6 after:h-0.5 after:bg-slate-100 after:rotate-45"
        : ""
    }`}
            ></i>
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
            className="form-control h-12 w-full border-2 border-slate-100 bg-transparent text-slate-100 px-5 placeholder-slate-100 rounded-md"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <i
              className={`relative lni lni-eye text-2xl text-slate-100 flex items-center justify-center
    ${
      !showPassword.confirmPassword
        ? "after:content-[''] after:absolute after:w-6 after:h-0.5 after:bg-slate-100 after:rotate-45"
        : ""
    }`}
            ></i>
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <button
          type="submit"
          disabled={loading}
          className="h-12 bg-slate-100 text-black text-sm px-7 font-semibold rounded-md hover:bg-black hover:text-slate-100 transition-all cursor-pointer"
        >
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>

        <p className="text-slate-100! text-sm">
          Voltar para{" "}
          <Link
            to="/login"
            className="underline font-semibold hover:text-gray-300 transition"
          >
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
