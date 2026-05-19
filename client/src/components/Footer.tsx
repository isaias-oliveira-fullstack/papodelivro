import useTemplateScripts from "@/hooks/useTemplateScripts";
import Logo from "@/Logo";

const Footer = () => {
  const { NavLink, Link } = useTemplateScripts();
  
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
      icon: "lni lni-facebook-square",
      href: "https://facebook.com/skynetsites",
    },
    {
      icon: "lni lni-instagram",
      href: "https://www.instagram.com/skynetsites",
    },
    {
      icon: "lni lni-x",
      href: "https://x.com/skynetsites",
    },
    {
      icon: "lni lni-linkedin",
      href: "https://www.linkedin.com/in/isaias-oliveira-dev",
    },
    {
      icon: "lni lni-github",
      href: "https://github.com/isaias-oliveira-fullstack",
    },
  ];

  return (
    <footer className="bg-primary dark:bg-dark-primary py-11 pb-5 lg:py-19 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col items-start">
            <Logo />
            <p className="text-slate-200 mt-6 leading-7 max-w-xl">
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
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-100 text-slate-100 text-lg hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    <i className={`${social.icon} leading-none`}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
      </div>

      <div className="border-t border-white/10 mt-16 pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-200 text-sm">
              © 2026 <strong>Papo de Livro</strong>. Todos os direitos
              reservados.
            </p>
            <p className="text-slate-200 text-sm mr-0 lg:mr-5">
              Desenvolvido por{" "}
              <Link
                to="https://www.linkedin.com/in/skynetsites/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline decoration-solid font-semibold
            transition-colors duration-300 ease-in-out"
              >
                Isaias Oliveira
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
