import useTemplateScripts from "@/hooks/useTemplateScripts";
import { Button } from "@/components/ui/button";

const menuUserItems = [
  {
    icon: "lni lni-check-square-2",
    label: "Aprovações",
    to: "/admin/aprovacoes",
    admin: true,
  },
  {
    icon: "lni lni-envelope-1",
    label: "Caixa de Entrada",
    to: "/admin/mensagens",
    admin: true,
  },
  {
    icon: "lni lni-books-2",
    label: "Livros",
    to: "/admin/livros",
    admin: true,
  },
  {
    icon: "lni lni-user-multiple-4",
    label: "Usuários",
    to: "/admin/usuarios",
    admin: true,
  },

  {
    icon: "lni lni-book-1",
    label: "Meus Livros",
    to: "/meus-livros",
  },
  {
    icon: "lni lni-user-4",
    label: "Meu Perfil",
    to: "/perfil",
  },
  {
    icon: "lni lni-message-3-text",
    label: "Minhas Mensagens",
    to: "/minhas-mensagens",
  },
  {
    icon: "lni lni-notebook-1",
    label: "Meus Resumos",
    to: "/meus-resumos",
  },
  {
    icon: "lni lni-star-fat",
    label: "Minhas Avaliações",
    to: "/minhas-avaliacoes",
  },
];

const MenuUsers = () => {
  const { NavLink, user, handleLogout } = useTemplateScripts();

  return (
    <>
      {menuUserItems
        .filter((item) => !item.admin || user?.role === "admin")
        .map((item) => (
          <li>
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 rounded-lg px-3 h-9 text-sm hover:bg-primary hover:text-slate-100 transition-all"
            >
              <i
                className={`${item.icon} text-xl flex items-center justify-center`}
              />

              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}

      <Button
        onClick={handleLogout}
        className="mt-2 w-full h-9 rounded-lg text-white border-2 border-transparent transition-all hover:bg-transparent hover:text-primary hover:border-primary dark:hover:border-white dark:hover:text-white cursor-pointer"
      >
        Sair
      </Button>
    </>
  );
};

export default MenuUsers;
