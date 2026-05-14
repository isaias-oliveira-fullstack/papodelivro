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
              <p className="mb-4">
                O Papo de Livro foi criado para aproximar leitores que gostam de compartilhar experiências, opiniões e descobertas através da leitura. Além de acessar uma coleção especial de livros, você também pode participar ativamente da comunidade.
              </p>
              <p className="mb-4">
                Nela, é possível:
              </p>
              <ul className="list-inside mb-4 text-slate-600 dark:text-slate-300">
                <li className="before:content-['📖'] before:mr-2 mb-3">
                  Adicionar, editar ou remover livros e resumos da sua biblioteca.
                </li>
                <li className="before:content-['📖'] before:mr-2 mb-3">
                  Buscar obras e autores de forma rápida e prática.
                </li>
                <li className="before:content-['📖'] before:mr-2 mb-3">
                  Favoritar os livros que mais marcaram você.
                </li>
                <li className="before:content-['📖'] before:mr-2 mb-3">
                  Avaliar títulos e deixar comentários sobre suas leituras.
                </li>
                <li className="before:content-['📖'] before:mr-2 mb-3">
                  Recomendações de livros indicados por outros usuários.
                </li>
                <li className="before:content-['📖'] before:mr-2  mb-4">
                  Enviar resumos ou sugerir novas obras para a plataforma.
                </li>
              </ul>
              <p className="mb-0">
                Descubra novas histórias, explore diferentes mundos e, acima de tudo, nunca deixe de ler!
              </p>
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
