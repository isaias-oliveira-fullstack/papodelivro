import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import mockLivros from "@/data/mockData";
import BookCard from "@/components/BookCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getImageUrl } from "@/utils/imageUtils";
import type { Book } from "@/types";

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteBooks([]);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/books");
        const apiBooks: Book[] = Array.isArray(response.data)
          ? response.data
          : [];
        const apiBookMap = new Map(apiBooks.map((book) => [book.slug, book]));

        const mergedFavorites = favorites
          .map((slug) => {
            const apiBook = apiBookMap.get(slug);
            const mockBook = mockLivros.find((book) => book.slug === slug);

            if (apiBook && mockBook) {
              return {
                ...mockBook,
                ...apiBook,
                isPlaceholder: !apiBook.summary,
              };
            }

            if (apiBook) {
              return apiBook;
            }

            if (mockBook) {
              return { ...mockBook, cover_url: getImageUrl(mockBook) };
            }

            return null;
          })
          .filter((book): book is Book => Boolean(book));

        setFavoriteBooks(mergedFavorites);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        setFavoriteBooks(
          favorites
            .map((slug) => mockLivros.find((book) => book.slug === slug))
            .filter((book): book is Book => Boolean(book))
            .map((book) => ({ ...book, cover_url: getImageUrl(book) })),
        );
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  return (
    <>
        {loading ? (
    <section className="max-w-auto md:max-w-7xl px-4 mx-auto">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <p className="text-slate-600 dark:text-slate-300">
              Carregando favoritos...
            </p>
          </div>
          </section>
        ) : favoriteBooks.length === 0 ? (
          /* EMPTY STATE */
          <section className="flex min-h-[57vh] items-center justify-center">
          <div className="mx-auto w-full max-w-xl rounded-lg border p-8 shadow-sm relative overflow-hidden bg-primary dark:bg-dark-primary">
            <div className="absolute top-0 left-0 z-1 h-full w-full bg-[url(/assets/images/hero/default-bg.png)] bg-cover bg-center bg-no-repeat opacity-70 dark:opacity-20"></div>
          <div className="relative z-10">
            <div className="space-y-4 text-center mb-6">
          <h2 className="text-3xl font-semibold text-slate-100!">Adicione ao Favoritos</h2>
          <p className="text-slate-300! leading-6">Você ainda não adicionou nenhum livro aos favoritos.</p>
<div className="mt-8">
            <Link
              to="/livros"
              className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-gray-200 transition cursor-pointer"
            >
              Explorar livros
            </Link>
            </div>
          </div>
          </div>
          </div>
          </section>
        ) : (
        <section className="pb-12 space-y-7">
      <div className="bg-gray-200 py-6 transition dark:bg-slate-900/95 sm:p-8">
        <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
          <h2 className="text-3xl font-semibold mb-0">
            Favoritos
          </h2>
          <p className="mt-2 text-sm">
            Veja seus livros favoritos salvos no banco de dados.
          </p>
        </div>
      </div>
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {favoriteBooks.map((livro) => (
              <BookCard key={livro.slug || livro.id} livro={livro} />
            ))}
          </div>
      </div>
    </section>
        )}
        </>
  );
};

export default FavoritesPage;
