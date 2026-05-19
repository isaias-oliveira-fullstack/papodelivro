import { Card } from "./ui/card";

const features = [
  {
    icon: "lni lni-books-2",
    title: "Catálogo Literário",
    description:
      "Explore uma biblioteca completa com diversos títulos e descubra novas leituras que combinam com seu gosto.",
  },
  {
    icon: "lni lni-pen-to-square",
    title: "Resenhas Literárias",
    description:
      "Escreva suas próprias resenhas e leia opiniões detalhadas de outros leitores sobre diferentes livros.",
  },
  {
    icon: "lni lni-heart" as const,
    title: "Livros Favoritos",
    description:
      "Salve seus livros preferidos e organize sua estante pessoal para acessar facilmente quando quiser.",
  },
  {
    icon: "lni lni-user-multiple-4" as const,
    title: "Rede Social",
    description:
      "Conecte-se com outros leitores, compartilhe experiências e descubra recomendações da comunidade.",
  },
  {
    icon: "lni lni-search-text" as const,
    title: "Busca Avançada",
    description:
      "Encontre livros rapidamente usando filtros por título, autor ou gênero de forma prática e eficiente no dia a dia.",
  },
  {
    icon: "lni lni-star-fat" as const,
    title: "Avaliações Gerais",
    description:
      "Dê notas aos livros e acompanhe a média geral baseada nas avaliações feitas por outros leitores da plataforma.",
  },
];

const Features = () => {

  return (
    <section id="recursos" className="pt-20" data-delay="200">
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <span className="mb-4 lg:mb-6 px-6 py-3 bg-gray-200 text-primary uppercase rounded-full inline-block font-semibold text-sm">
            Recursos
          </span>

          <h2 className="text-xl sm:2xl md:text-3xl lg:text-4xl font-bold mb-8 block">
            Sua jornada literária completa
          </h2>

          <p className="block mb-5">
            Descubra livros, escreva resenhas, avalie obras e conecte-se com
            outros leitores em um único lugar.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="shadow-lg rounded-lg overflow-hidden border-slate-200 hover:shadow-2xl transition-all duration-300 p-6 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-3 text-4xl text-white bg-primary border-0 rounded-lg">
                <i className={`${feature.icon} flex items-center justify-center`}></i>
              </div>

              <h3 className="text-xl font-semibold">{feature.title}</h3>

              <p className="text-base leading-6 text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
