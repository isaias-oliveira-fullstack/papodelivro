import type { Book } from "@/types";
import BookCard from "@/components/BookCard";
import useTemplateScripts from "@/hooks/useTemplateScripts";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  loading: boolean;
  latestBooks: Book[];
};

const Books = (props: HeaderProps) => {
  const { loading, latestBooks } = props;
  const { navigate } = useTemplateScripts();

  return (
    <section
      id="biblioteca"
      className="relative overflow-hidden py-16 lg:py-24 bg-primary dark:bg-dark-primary"
    >
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
        <div className="px-10 mb-10 sm:px-20 md:px-40 lg:px-80 lg:mb-20 text-center">
          <span className="mb-4 lg:mb-6 px-6 py-3 bg-gray-200 text-primary uppercase rounded-full inline-block font-semibold text-sm">
            Biblioteca
          </span>
          <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-5 text-white!">
            Adicionados Recentemente
          </h2>
          <p className="text-slate-300! leading-6">
            Explore os destaques mais recentes da nossa comunidade.
          </p>
        </div>
        {loading ? (
          <p className="text-sm align-center font-semibold text-slate-200">
            Carregando...
          </p>
        ) : (
          <>
            <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {latestBooks.map((book) => (
                <BookCard key={book.slug || book.id} livro={book} />
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/livros")}
                className="rounded-lg border-2 border-white px-6 h-12 font-semibold text-white bg-transparent hover:bg-white hover:text-primary transition cursor-pointer"
              >
                Ir para a biblioteca de livros
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Books;
