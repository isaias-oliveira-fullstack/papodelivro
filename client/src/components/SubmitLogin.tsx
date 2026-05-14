import { useState, type SyntheticEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SubmitLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    //setError(null);
    setLoading(true);

    if (!email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      const user = await signIn({ email, password, rememberMe });

      const redirectPath = redirectParam?.startsWith("/")
        ? redirectParam
        : null;

      console.log("redirectPath FINAL:", redirectPath);

      toast.success("Login realizado com sucesso!");

      if (user.role === "admin") {
        navigate("/admin/aprovacoes", { replace: true });
        return;
      }

      if (redirectPath) {
        setTimeout(() => {
          console.log("CHEGUEI NO NAVIGATE FINAL");
          navigate(redirectPath, { replace: true });
        }, 1000);
        return;
      }

      navigate("/", { replace: true });
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error
          ? err.message
          : "Falha no login. Verifique suas credenciais.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  console.log("LOCATION:", location);
  console.log("SEARCH:", location.search);
  console.log("REDIRECT PARAM:", redirectParam);

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control h-12 w-full border-2 border-white bg-transparent text-white px-5 placeholder-white rounded-md"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control h-12 w-full border-2 border-white bg-transparent text-white px-5 placeholder-white rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Mostrar/Ocultar senha"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {showPassword ? (
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-100!">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((v) => !v)}
              className="
      relative
      h-4.5 w-4.5
      appearance-none
      rounded
      border border-slate-300
      bg-transparent
      checked:bg-transparent
      checked:border-white

      after:absolute
      after:left-1.5
      after:top-0.4
      after:hidden
      after:h-3
      after:w-1.5
      after:rotate-45
      after:border-b-2
      after:border-r-2
      after:border-white

      checked:after:block
    "
            />
            Lembrar meu acesso
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-slate-100!"
          >
            Esqueci minha senha?
          </Link>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-12 bg-white text-black text-sm px-7 font-semibold rounded-md hover:bg-black hover:text-white transition-all cursor-pointer"
          >
            {loading ? "Acessando..." : "Acessar conta"}
          </button>

          <p className="text-slate-100! text-sm">
            Não tem conta?{" "}
            <Link
              to="/register"
              className="underline font-semibold hover:text-gray-300 transition"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default SubmitLogin;
