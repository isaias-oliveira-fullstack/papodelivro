import { NavLink, Link } from "react-router-dom";
import useTemplateScripts from "@/hooks/useTemplateScripts";

const Footer = () => {
  const { getIcon } = useTemplateScripts();

  const footerMenus = [
    {
      title: "Navegação",
      id: "main-menu",

      links: [
        {
          name: "Sobre",
          href: "sobre",
          state: true,
        },
        {
          name: "Etapas",
          href: "etapas",
          state: true,
        },
        {
          name: "Biblioteca",
          href: "biblioteca",
          state: true,
        },
        {
          name: "Recursos",
          href: "recursos",
          state: true,
        },
      ],
    },

    {
      title: "Área do Leitor",
      id: "main-menu",

      links: [
        {
          name: "Perfil",
          href: "perfil",
          state: false,
        },
        {
          name: "Favoritos",
          href: "favoritos",
          state: false,
        },
        {
          name: "Meus Livros",
          href: "meus-livros",
          state: false,
        },
        {
          name: "Minhas Avaliações",
          href: "minhas-avaliacoes",
          state: false,
        },
      ],
    },

    {
      title: "Suporte",
      id: "main-menu",

      links: [
        {
          name: "Termos de Uso",
          href: "/termos-de-uso",
        },
        {
          name: "Política de Privacidade",
          href: "/politica-de-privacidade",
        },
        {
          name: "Perguntas Frequentes",
          href: "contato",
          state: true,
        },
        {
          name: "Fale Conosco",
          href: "contato",
          state: true,
        },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: "lni lni-facebook-original",
      href: "https://facebook.com",
    },
    {
      icon: "lni lni-twitter-original",
      href: "https://twitter.com",
    },
    {
      icon: "lni lni-instagram",
      href: "https://instagram.com",
    },
    {
      icon: "lni lni-linkedin-original",
      href: "https://linkedin.com",
    },
  ];

  return (
    <footer className="bg-primary dark:bg-dark-primary py-16 pb-10 lg:py-26 lg:pb-18">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <NavLink
              to="/"
              state={{ section: "inicio" }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-white">
                {getIcon("book-open", "text-primary", 25)}
              </div>

              <div className="leading-tight">
                <h1 className="text-[1.3rem] font-semibold text-white">
                  Papo de Livro
                </h1>

                <p className="text-sm text-slate-300">Sua biblioteca digital</p>
              </div>
            </NavLink>

            <p className="text-slate-200 mt-8 leading-7 max-w-xl">
              Explore novas histórias, descubra diferentes mundos e compartilhe
              experiências literárias com outros leitores apaixonados.
            </p>

            <ul className="flex items-center gap-3 mt-4">
              {socialLinks.map((social, index) => (
                <li key={index}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white text-lg hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    <i className={social.icon}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center lg:text-left">
            {footerMenus.map((menu, index) => (
              <div key={index} id={index === 0 ? "main-menu" : undefined}>
                <h2 className="text-white font-semibold text-xl mb-6">
                  {menu.title}
                </h2>

                <ul className="space-y-5">
                  {menu.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <NavLink
                        to={link.state ? "/" : link.href}
                        state={link.state ? { section: link.href } : undefined}
                        className="text-slate-300 hover:text-white transition-all duration-300"
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-slate-200 text-sm">
            © 2026 Papo de Livro. Todos os direitos reservados.
          </p>
          <p className="text-slate-200 text-sm">
          Desenvolvido por {" "}
          <Link
          to="https://www.linkedin.com/in/skynetsites/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-solid font-semibold
            transition-colors duration-300 ease-in-out"
        >
          Isaias Oliveira
        </Link>.
        </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
