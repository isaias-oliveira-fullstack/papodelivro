export default function Login() {
  return (
    <div className="min-h-screen bg-background flex">

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#d4b00f] via-brand to-[#c9a40d] p-12 items-center justify-center relative overflow-hidden">
        <div className="max-w-md text-background">

          <h1 className="text-4xl font-bold mb-6">
            CODA.CE LAB
          </h1>

          <p className="text-xl mb-12 opacity-90">
            A plataforma que conecta desenvolvedores talentosos do Ceará com oportunidades incríveis.
          </p>

          <div className="grid grid-cols-2 gap-6">

            <div className="flex items-center gap-3 p-4 bg-background/10 backdrop-blur-sm rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code w-6 h-6">
                <path d="m16 18 6-6-6-6"></path>
                <path d="m8 6-6 6 6 6"></path>
              </svg>
              <span className="font-medium">Projetos inovadores</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-background/10 backdrop-blur-sm rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-6 h-6">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <span className="font-medium">Comunidade ativa</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-background/10 backdrop-blur-sm rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase w-6 h-6">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                <rect width="20" height="14" x="2" y="6" rx="2"></rect>
              </svg>
              <span className="font-medium">Oportunidades reais</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-background/10 backdrop-blur-sm rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket w-6 h-6">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              <span className="font-medium">Crescimento contínuo</span>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-background/20">
            <p className="text-sm opacity-80">
              Novo por aqui?{" "}
              <button className="font-semibold underline hover:no-underline">
                Crie sua conta grátis
              </button>
            </p>
          </div>

        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <a className="inline-block mb-6" href="/lab">
              <span className="text-3xl font-bold text-brand">CODA.CE</span>
              <span className="text-3xl font-bold text-foreground"> LAB</span>
            </a>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-surface rounded-xl p-1.5 border border-brand-subtle inline-flex">
              <button className="px-6 py-2.5 rounded-lg font-semibold transition-all bg-brand text-background shadow-md">
                Entrar
              </button>
              <button className="px-6 py-2.5 rounded-lg font-semibold transition-all text-muted hover:text-foreground">
                Criar Conta
              </button>
            </div>
          </div>

          <div className="relative min-h-[400px]">

            <form className="space-y-5">

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Bem-vindo de volta!
                </h2>
                <p className="text-muted">
                  Entre na sua conta para continuar
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl"
                  placeholder="seu@email.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Senha
                </label>
                <input
                  className="w-full pl-12 pr-12 py-3 bg-surface border border-border rounded-xl"
                  placeholder="Sua senha"
                  type="password"
                />
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand text-background font-bold rounded-xl">
                Entrar
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted">
                    ou continue com
                  </span>
                </div>
              </div>

              <a
                href="https://api.coda-ce.com.br/api/auth/github"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#24292e] text-white font-medium rounded-xl"
              >
                Entrar com GitHub
              </a>

              <div className="text-center mt-4">
                <a className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  Explorar plataforma sem conta
                </a>
              </div>

            </form>

          </div>
        </div>
      </div>

    </div>
  );
}