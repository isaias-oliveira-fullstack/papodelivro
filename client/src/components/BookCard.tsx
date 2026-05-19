import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Book } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/imageUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  livro: Book;
}

const BookCard = ({ livro }: BookCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = getImageUrl(livro);

  const { signed } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isBookFavorite = isFavorite(livro.slug);

  const handleAction = () => {
    if (livro.slug) {
      navigate(`/livro/${livro.slug}`);
    } else {
      console.error("Tentativa de navegar para um livro sem slug:", livro);
    }
  };

  const handleFavoriteToggle = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!signed) {
      toast.info("Faça login para favoritar. Redirecionando...");
      setTimeout(() => navigate("/login", { state: { from: location } }), 800);
      return;
    }

    if (!livro.slug) {
      toast.error("Não foi possível identificar o livro.");
      return;
    }

    const wasFavorite = isBookFavorite;

    try {
      await toggleFavorite(livro.slug);

      if (wasFavorite) {
        toast.info("Removido dos favoritos.");
      } else {
        toast.success("Adicionado aos favoritos!", {
          action: {
            label: "Ver favoritos",
            onClick: () => navigate("/favoritos"),
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o favorito.");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAction();
    }
  };

  return (
    <Card
      tabIndex={0}
      onClick={handleAction}
      onKeyDown={handleKeyDown}
      className="py-0 relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 cursor-pointer"
    >
      <i
        onClick={handleFavoriteToggle}
        className={`${
          isBookFavorite
            ? "before:text-slate-100! before:font-bold! bg-red-500! border-2! border-red-600!"
            : ""
        } lni lni-heart text-xl flex absolute right-4 top-4 z-10 h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900`}
      ></i>

      <div className="relative h-80 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imageUrl}
          alt={`Capa do livro ${livro.title}`}
          loading="lazy"
          width={200}
          height={300}
          className={`h-full w-full object-cover transition duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />

        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between pt-0 p-5 text-left">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-white">
            {livro.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {livro.author}
          </p>
        </div>

        <Button 
          variant="outline" 
          className="px-8 mt-3 h-10 text-center bg-primary font-semibold text-slate-100 hover:bg-transparent border-2 border-primary hover:text-primary transition cursor-pointer"
          onClick={handleAction}
        >
          Ler Resenha
        </Button>
      </div>
    </Card>
  );
};

export default BookCard;
