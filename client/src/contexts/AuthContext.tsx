import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import type { AuthContextData, AuthCredentials, SignUpData, User } from "@/types";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoragedData = () => {
      const storagedUser =
        localStorage.getItem("@PapoDeLivro:user") ||
        sessionStorage.getItem("@PapoDeLivro:user");

      const storagedToken =
        localStorage.getItem("@PapoDeLivro:token") ||
        sessionStorage.getItem("@PapoDeLivro:token");

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser) as User);
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      }

      setLoading(false);
    };

    loadStoragedData();
  }, []);

  const signIn = async ({ email, password, rememberMe = false }: AuthCredentials) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: apiUser, token } = response.data;

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("@PapoDeLivro:user", JSON.stringify(apiUser));
      storage.setItem("@PapoDeLivro:token", token);

      setUser(apiUser);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      toast.success(
        apiUser.role === "admin"
          ? "Bem-vindo ao painel, administrador!"
          : `Bem-vindo de volta, ${apiUser.name.split(" ")[0] || "leitor"}!`
      );

      return apiUser;
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data?.error
          : null;

      throw new Error(message || "Falha no login");
    }
  };

  const signOut = () => {
    const role = user?.role;

    localStorage.removeItem("@PapoDeLivro:user");
    localStorage.removeItem("@PapoDeLivro:token");
    sessionStorage.removeItem("@PapoDeLivro:user");
    sessionStorage.removeItem("@PapoDeLivro:token");

    setUser(null);
    delete api.defaults.headers.Authorization;

    toast.info(
      role === "admin"
        ? "Logout realizado. Até a próxima, administrador!"
        : "Logout realizado com sucesso. Até a próxima!"
    );
  };

  const signUp = async ({ name, email, password }: SignUpData) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      const { user: apiUser, token } = response.data;

      localStorage.setItem("@PapoDeLivro:user", JSON.stringify(apiUser));
      localStorage.setItem("@PapoDeLivro:token", token);

      setUser(apiUser);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      toast.success("Conta criada com sucesso!");

      return apiUser;
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data?.error
          : null;

      toast.error(message || "Erro ao cadastrar.");

      throw new Error(message || "Erro ao cadastrar");
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("@PapoDeLivro:user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
        signUp,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};