const content = [
  {
    type: "paragraph",
    text: "O Papo de Livro foi criado para aproximar leitores que gostam de compartilhar experiências, opiniões e descobertas através da leitura. Além de acessar uma coleção especial de livros, você também pode participar ativamente da comunidade.",
  },
  {
    type: "paragraph",
    text: "Nela, é possível:",
  },
  {
    type: "list",
    items: [
      "Adicionar, editar ou remover livros e resumos da sua biblioteca;",
      "Buscar obras e autores de forma rápida e prática;",
      "Favoritar os livros que mais marcaram você;",
      "Avaliar títulos e deixar comentários sobre suas leituras;",
      "Recomendações de livros indicados por outros usuários;",
      "Enviar resumos ou sugerir novas obras para a plataforma.",
    ],
  },
  {
    type: "paragraph",
    text: "Descubra novas histórias, explore diferentes mundos e, acima de tudo, nunca deixe de ler!",
  },
];

const AboutPage = () => {
  return (
    <section className="pb-12 space-y-6">
      <div className="bg-gray-200 py-6 transition dark:bg-slate-900/95 sm:p-8">
        <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
          <h2 className="text-3xl font-semibold mb-0">Sobre</h2>
          <p className="mt-2 text-sm">Sobre o Papo de Livro</p>
        </div>
      </div>
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
        <div className="rounded-lg border border-slate-200 p-8 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95">
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center">
            <div className="lg:pr-0">
              {content.map((item, index) => {
                if (item.type === "paragraph") {
                  return (
                    <p key={index} className={`${index === 1 ? "font-semibold" : "font-normal"} mb-4`}>
                      {item.text}
                    </p>
                  );
                }

                if (item.type === "list" && item.items) {
                  return (
                    <ul
                      key={index}
                      className="list-inside mb-4 text-slate-600 dark:text-slate-300"
                    >
                      {item.items.map((listItem) => (
                        <li
                          key={listItem}
                          className="flex items-start gap-1 ml-3 mb-2"
                        >
                          <i className="lni lni-book-1 text-xl text-primary dark:text-slate-100"></i>

                          <span>{listItem}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return null;
              })}
            </div>
            <div className="image overflow-hidden">
              <img
                className="rounded-xl"
                src="/assets/images/about/pg-about-image.png"
                alt="#"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
