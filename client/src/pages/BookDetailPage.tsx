import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "@/services/api";
import mockLivros from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/imageUtils";
import type { Book, Review } from "@/types";

interface StarRatingFormProps {
  onChange: (value: number) => void;
  initialValue?: number;
}

const StarRatingForm = ({
  onChange,
  initialValue = 0,
}: StarRatingFormProps) => {
  const [rating, setRating] = useState(initialValue);

  const handleClick = (value: number) => {
    setRating(value);
    onChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          type="button"
          key={value}
          onClick={() => handleClick(value)}
          className={`rounded-full px-3 py-2 text-lg transition ${value <= rating ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const BookDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { signed, user } = useAuth();
  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<
    number | string | null
  >(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      setError("");
      setBookData(null);
      setReviews([]);

      let fetchedSlug: string | undefined = slug;

      try {
        const response = await api.get(`/books/${slug}`);
        setBookData(response.data as Book);
      } catch (outerError: unknown) {
        if (
          typeof outerError === "object" &&
          outerError !== null &&
          "response" in outerError &&
          (outerError as any).response?.status === 404
        ) {
          const mockBook = mockLivros.find((book) => book.slug === slug);
          if (mockBook) {
            setBookData({
              ...mockBook,
              summary: null,
              submitted_by: null,
              full_cover_url: getImageUrl(mockBook),
            });
          } else {
            setError("Livro não encontrado.");
            fetchedSlug = undefined;
          }
        } else {
          setError("Não foi possível carregar o livro.");
          fetchedSlug = undefined;
        }
      }

      if (fetchedSlug) {
        try {
          const reviewUrls = [
            `/books/${fetchedSlug}/reviews`,
            `/reviews?bookSlug=${encodeURIComponent(fetchedSlug)}`,
            `/reviews?book_slug=${encodeURIComponent(fetchedSlug)}`,
            `/reviews?slug=${encodeURIComponent(fetchedSlug)}`,
          ];

          let reviewsLoaded = false;
          for (const reviewUrl of reviewUrls) {
            try {
              const response = await api.get(reviewUrl);
              setReviews(response.data as Review[]);
              reviewsLoaded = true;
              break;
            } catch (reviewError: unknown) {
              const status =
                typeof reviewError === "object" &&
                reviewError !== null &&
                "response" in reviewError
                  ? (reviewError as any).response?.status
                  : null;

              if (status !== 404) {
                console.error(
                  `Erro ao carregar avaliações no endpoint ${reviewUrl}:`,
                  reviewError,
                );
              }
            }
          }

          if (!reviewsLoaded) {
            setReviews([]);
          }
        } catch (innerError: unknown) {
          console.error("Erro ao carregar avaliações:", innerError);
          setReviews([]);
        }
      }

      setLoading(false);
    };

    fetchBookData();
  }, [slug]);

  const handleDeleteReview = async (id: number | string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?"))
      return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err) {
      console.error("Erro ao excluir avaliação:", err);
      alert("Erro ao excluir avaliação.");
    }
  };

  const handleFavoriteToggle = async () => {
    if (!signed) {
      toast("Faça login para favoritar.", {
        description: "Você precisa entrar para usar favoritos.",
      });
      return;
    }

    if (!bookData?.slug) {
      toast.error("Não foi possível identificar o livro.");
      return;
    }

    const alreadyFavorite = isFavorite(bookData.slug);

    try {
      await toggleFavorite(bookData.slug);

      if (!alreadyFavorite) {
        toast.success("Adicionado aos favoritos!", {
          action: {
            label: "Ver favoritos",
            onClick: () => navigate("/favoritos"),
          },
        });
      } else {
        toast("Removido dos favoritos.");
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      toast.error("Não foi possível atualizar o favorito.");
    }
  };

  const handleShare = async () => {
    if (!bookData || isSharing) return;

    const shareUrl = window.location.href;

    try {
      setIsSharing(true);

      if (navigator.share) {
        await navigator.share({
          title: bookData.title,
          text: `Confira ${bookData.title} no Papo de Livro`,
          url: shareUrl,
        });

        toast("Ação de compartilhamento concluída.");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
      toast.error("Não foi possível compartilhar o link.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id ?? null);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleUpdateReview: React.SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    if (!editingReviewId) return;

    try {
      const response = await api.put(`/reviews/${editingReviewId}`, {
        content: editContent,
        rating: editRating,
      });
      setReviews((prev) =>
        prev.map((rev) =>
          rev.id === editingReviewId ? (response.data as Review) : rev,
        ),
      );
      setEditingReviewId(null);
      setEditContent("");
      setEditRating(0);
    } catch (err) {
      console.error("Erro ao atualizar avaliação:", err);
      alert("Erro ao atualizar avaliação.");
    }
  };

  const hasReviewed = signed && reviews.some((r) => r.userId === user?.id);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        Carregando livro...
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        {error || "Livro não encontrado."}
      </div>
    );
  }

  return (
    <section className="pb-12 space-y-6">
      <div className="bg-gray-200 py-6 transition dark:bg-slate-900/95 sm:p-8">
        <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
          <h2 className="text-3xl font-semibold mb-0">Detalhes do Livro</h2>

          <p className="mt-2 text-sm">
            Explore informações, avaliações e resumos da obra
          </p>
        </div>
      </div>
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto space-y-6">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="rounded-lg border border-slate-200 bg-gray-200 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <img
              src={getImageUrl(bookData)}
              alt={`Capa do livro ${bookData.title}`}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>

          <div className="space-y-6 rounded-lg border border-slate-200 bg-gray-200 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Categoria
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">
                    {bookData.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    por {bookData.author}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleFavoriteToggle}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isFavorite(bookData.slug) ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}`}
                  >
                    {isFavorite(bookData.slug)
                      ? "Remover dos favoritos"
                      : "Favoritar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={isSharing}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isSharing ? "Compartilhando..." : "Compartilhar"}
                  </button>
                </div>
              </div>
              {bookData.category && (
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {bookData.category}
                </span>
              )}
            </div>

            {bookData.summary ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                  Resumo
                </h2>
                <p className="prose max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
                  {bookData.summary}
                </p>
                {bookData.submitted_by && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enviado por: <strong>{bookData.submitted_by}</strong>
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
                <p className="text-slate-700 dark:text-slate-300">
                  Este livro ainda não tem um resumo.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {signed ? (
                    <Link
                      to="/enviar-resumo"
                      state={{ book: bookData }}
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      Seja o primeiro a enviar!
                    </Link>
                  ) : (
                    <>
                      <Link
                        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
                        //to="/login"
                        //state={{ from: location }}
                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                      >
                        Entrar
                      </Link>
                      <Link
                        to="/register"
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        Criar Conta
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-gray-200 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                  Avaliações
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Compartilhe sua experiência com outros leitores.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950"
                  >
                    {editingReviewId === review.id ? (
                      <form className="space-y-4" onSubmit={handleUpdateReview}>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                          Editar Avaliação
                        </h3>
                        <StarRatingForm
                          onChange={(value) => setEditRating(value)}
                          initialValue={editRating}
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-slate-300 bg-gray-200 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        />
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReviewId(null)}
                            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-semibold text-slate-950 dark:text-white">
                            {review.user?.name || "Anônimo"}
                          </p>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
                            {"★".repeat(review.rating)}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                          {review.content}
                        </p>
                        {signed && user?.id === review.userId && (
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReview(review.id ?? "")
                              }
                              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-600 dark:text-slate-300">
                  Ainda não há avaliações para este livro.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              {signed && !editingReviewId ? (
                hasReviewed ? (
                  <div className="text-slate-700 dark:text-slate-200">
                    ✅ Você já avaliou este livro.
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      const content = formData.get("content") as string;
                      const rating = selectedRating;

                      if (!rating || !content) {
                        alert("Preencha a nota e o comentário.");
                        return;
                      }

                      try {
                        const response = await api.post(
                          `/books/${slug}/reviews`,
                          { rating, content },
                        );
                        setReviews((prev) => [
                          response.data as Review,
                          ...prev,
                        ]);
                        form.reset();
                        setSelectedRating(0);
                      } catch (err: unknown) {
                        if (
                          typeof err === "object" &&
                          err !== null &&
                          "response" in err &&
                          (err as any).response?.status === 404
                        ) {
                          try {
                            const response = await api.post("/reviews", {
                              bookSlug: slug,
                              rating,
                              content,
                            });
                            setReviews((prev) => [
                              response.data as Review,
                              ...prev,
                            ]);
                            form.reset();
                            setSelectedRating(0);
                            return;
                          } catch (fallbackError) {
                            console.error(
                              "Erro ao enviar avaliação fallback:",
                              fallbackError,
                            );
                          }
                        }

                        console.error("Erro ao enviar avaliação:", err);
                        alert("Não foi possível enviar sua avaliação.");
                      }
                    }}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                        Deixe sua avaliação
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Avalie o livro e compartilhe sua experiência.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                          Nota
                        </label>
                        <StarRatingForm
                          onChange={(value) => setSelectedRating(value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="content"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                          Comentário
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          rows={4}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        />
                      </div>
                      <button className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
                        Enviar Avaliação
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <div className="space-y-4 text-slate-700 dark:text-slate-200">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                    Deixe sua avaliação
                  </h3>
                  <p>Você precisa estar logado para avaliar este livro.</p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/login?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
                      //to="/login"
                      className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Criar Conta
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetailPage;
