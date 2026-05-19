import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SubmitRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    setLoading(true);

    try {
      await signUp({ name, email, password });

      toast.success("Conta criada com sucesso! 🎉");
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Falha no cadastro. Verifique os dados.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-control h-12 w-full border-2 border-slate-100 bg-transparent text-slate-100 px-5 placeholder:text-slate-300 dark:placeholder:text-slate-400 rounded-md"
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-control h-12 w-full border-2 border-slate-100 bg-transparent text-slate-100 px-5 placeholder:text-slate-300 dark:placeholder:text-slate-400 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type={showPassword.password ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            type={showPassword.confirmPassword ? "text" : "password"}
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-control h-12 w-full border-2 border-slate-100 bg-transparent text-slate-100 px-5 placeholder:text-slate-300 dark:placeholder:text-slate-400 rounded-md"
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
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <p className="text-slate-100! text-sm">
          Já tenho uma conta!{" "}
          <Link
            to="/login"
            className="underline font-semibold hover:text-gray-300 transition cursor-pointer"
          >
            Entre aqui
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SubmitRegister;
