import useTemplateScripts from "@/hooks/useTemplateScripts";
import { Button } from "@/components/ui/button";
import Logo from "@/Logo";
import MenuUsers from "@/components/MenuUsers";

const menuItems = [
  { state: "inicio", label: "Início" },
  { state: "sobre", label: "Sobre" },
  { state: "etapas", label: "Etapas" },
  { state: "biblioteca", label: "Biblioteca" },
  { state: "recursos", label: "Recursos" },
  { state: "contato", label: "Contato" },
];

const Header = () => {
  const {
    activeSection,
    pathname,
    NavLink, 
    Link,
    signed,
    user,
    dropdownOpen,
    dropdownRef,
    setDropdownOpen,
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
            <Logo />
            <div
              id="main-menu"
              className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-full lg:w-auto top-full lg:top-auto"
            >
              <ul className="flex flex-col p-0 py-5 lg:py-0 px-6 lg:px-0 gap-4 bg-white lg:bg-transparent lg:flex-row lg:items-center max-w-full lg:gap-8">
                {menuItems.map((item) => (
                  <li key={item.state}>
                    <NavLink
                      to="/"
                      state={{ section: item.state }}
                      className={`text-primary lg:text-white transition-all duration-300 hover:font-semibold hover:-translate-y-0.5 ${
                        activeSection === item.state ? "font-semibold" : ""
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
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-slate-200 bg-transparent px-0 lg:px-4 w-9 lg:w-auto h-8 lg:h-11 text-sm font-medium text-white shadow-sm transition hover:bg-slate-50 hover:text-primary cursor-pointer"
                >
                  <i className="lni lni-user-4 text-xl leading-none"></i>
                  <span className="hidden lg:inline-block">Entrar</span>
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="outline"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-slate-200 bg-transparent px-0 lg:px-4 w-9 lg:w-auto h-9 lg:h-11 text-sm font-medium text-white shadow-sm transition hover:bg-slate-50! hover:text-primary! cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1 font-medium">
                      <i className="lni lni-user-4 text-xl leading-none"></i>

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
                      <i className="lni lni-chevron-down text-xl flex items-center justify-center"></i>
                    </span>
                  </Button>

                  {dropdownOpen && (
                    <ul
                      onClick={() => setDropdownOpen(false)} 
                      className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
                      <MenuUsers />
                    </ul>
                  )}
                </div>
              )}

              <Button
                id="navbar-toggler"
                className="block mobile-menu-btn navbar-toggler focus:outline-none lg:hidden"
              >
                <i className="lni lni-menu-hamburger-1 text-slate-100 text-4xl flex items-center justify-center leading-none"></i>
              </Button>

              <Link
                to="/enviar-resumo"
                className="hidden lg:inline-flex items-center justify-center whitespace-nowrap rounded-lg border-2 border-slate-200 bg-white px-4 h-11 text-sm font-semibold text-primary shadow-sm transition hover:bg-slate-50"
              >
                Enviar Resumo
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
