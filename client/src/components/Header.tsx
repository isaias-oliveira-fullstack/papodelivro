import { NavLink } from "react-router-dom";
import useTemplateScripts from "@/hooks/useTemplateScripts";
import { Button } from "@/components/ui/button";

const menuItems = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "etapas", label: "Etapas" },
  { id: "biblioteca", label: "Biblioteca" },
  { id: "recursos", label: "Recursos" },
  { id: "contato", label: "Contato" },
];

const menuUserItems = [
  {
    icon: "lni lni-checkmark-circle",
    label: "Aprovações",
    to: "/admin/aprovacoes",
    admin: true,
  },
  {
    icon: "lni lni-envelope",
    label: "Caixa de Entrada",
    to: "/admin/mensagens",
    admin: true,
  },
  {
    icon: "lni lni-library",
    label: "Livros",
    to: "/admin/livros",
    admin: true,
  },
  {
    icon: "lni lni-users",
    label: "Usuários",
    to: "/admin/usuarios",
    admin: true,
  },

  {
    icon: "lni lni-book",
    label: "Meus Livros",
    to: "/meus-livros",
  },
  {
    icon: "lni lni-user",
    label: "Meu Perfil",
    to: "/perfil",
  },
  {
    icon: "lni lni-envelope",
    label: "Minhas Mensagens",
    to: "/minhas-mensagens",
  },
  {
    icon: "lni lni-write",
    label: "Meus Resumos",
    to: "/meus-resumos",
  },
  {
    icon: "lni lni-star-fill",
    label: "Minhas Avaliações",
    to: "/minhas-avaliacoes",
  },
];

const Header = () => {
  const {
    activeSection,
    pathname,
    signed,
    user,
    handleLogout,
    dropdownOpen,
    dropdownRef,
    setDropdownOpen,
    getIcon,
  } = useTemplateScripts();

  const isHome = pathname === "/";

  return (
    <div
      className={`header_area left-0 top-0 w-full ${isHome && "absolute z-20"}`}
    >
      <div
        className={`navbar-area ${!isHome && "bg-primary"} dark:bg-dark-primary`}
      >
        <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
          <nav className="flex items-center py-5">
            <div className="flex items-center gap-3 text-white flex-none">
              <NavLink
                to="/"
                state={{ section: "inicio" }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-white">
                  {getIcon("book-open", "text-primary", 25)}
                </div>

                <div className="leading-tight">
                  <h1 className="text-[1.25rem] font-semibold mb-[0.35rem]">
                    Papo de Livro
                  </h1>
                  <p className="text-[0.8rem] text-slate-300">
                    Sua biblioteca digital
                  </p>
                </div>
              </NavLink>
            </div>
            <div
              id="main-menu"
              className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-full lg:w-auto top-full lg:top-auto"
            >
              <ul className="flex flex-col p-0 py-5 lg:py-0 px-6 lg:px-0 gap-4 bg-white lg:bg-transparent lg:flex-row lg:items-center max-w-full lg:gap-8">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to="/"
                      state={{ section: item.id }}
                      className={`text-primary lg:text-white transition-all duration-300 hover:font-semibold hover:-translate-y-0.5 ${
                        activeSection === item.id ? "font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 flex-none ml-auto">
              {!signed ? (
                <NavLink
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-transparent px-0 lg:px-4 py-0 lg:py-2 w-9 lg:w-auto h-9 lg:h-auto text-sm font-medium text-white shadow-sm transition hover:bg-slate-50 hover:text-primary cursor-pointer"
                >
                  {getIcon("user", "", 19)}
                  <span className="hidden lg:inline-block">Entrar</span>
                </NavLink>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="outline"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-transparent px-0 lg:px-4 py-0 lg:py-2 w-9 lg:w-auto h-9 lg:h-auto text-sm font-medium text-white shadow-sm transition hover:bg-slate-50! hover:text-primary! cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1 font-medium">
                      {getIcon("user", "", 19)}

                      <span className="hidden lg:inline-block">
                        Olá,{" "}
                        {user?.role === "admin"
                          ? "Admin"
                          : (user?.name?.split(" ")[0] ?? "Leitor")}
                      </span>
                    </span>

                    <span
                      className={`hidden lg:inline-block transition-transform ${
                        dropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      {getIcon("chevron-down", "", 20)}
                    </span>
                  </Button>

                  {dropdownOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-56 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
                      {menuUserItems
                        .filter((item) => !item.admin || user?.role === "admin")
                        .map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-slate-100"
                          >
                            <i className={`${item.icon} text-base`} />

                            <span>{item.label}</span>
                          </NavLink>
                        ))}

                      <Button
                        onClick={handleLogout}
                        className="mt-2 w-full rounded-lg text-white border-2 border-transparent transition-all hover:bg-transparent hover:text-primary hover:border-primary dark:hover:border-white dark:hover:text-white cursor-pointer"
                      >
                        Sair
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <Button
                id="navbar-toggler"
                className="block mobile-menu-btn navbar-toggler focus:outline-none lg:hidden"
              >
                {getIcon("menu", "text-white", 35)}
              </Button>

              {/* CTA */}
              <NavLink
                to="/enviar-resumo"
                className="hidden lg:inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Enviar Resumo
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
