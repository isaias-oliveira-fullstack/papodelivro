import { Link } from "react-router-dom";
const stepsData = [
  {
    image: "/assets/images/steps/step-1.png",
    title: "Crie sua conta",
    description:
      "Cadastre-se gratuitamente e desbloqueie todos os recursos para começar sua jornada.",
    icon: "Usuário",
    link: "/register",
    readTime: "Criar conta",
  },
  {
    image: "/assets/images/steps/step-2.png",
    title: "Descubra novos livros",
    description:
      "Explore categorias e encontre livros que combinam com seu estilo de leitura.",
    icon: "Explorar",
    link: "/livros",
    readTime: "Descobrir",
  },
  {
    image: "/assets/images/steps/step-3.png",
    title: "Leia e avalie",
    description:
      "Compartilhe avaliações e resenhas para ajudar outros leitores a escolher melhor.",
    icon: "Avaliação",
    link: "/livros",
    readTime: "Avaliar",
  },
  {
    image: "/assets/images/steps/step-4.png",
    title: "Conecte-se",
    description:
      "Interaja comentando nos livros e descubra recomendações de leitores na comunidade.",
    icon: "Comunidade",
    link: "/livros",
    readTime: "Conectar",
  },
];

const Steps = () => {
  return (
    <section id="etapas" className="py-20" data-delay="200">
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <span className="mb-4 lg:mb-6 px-6 py-3 bg-gray-200 text-primary uppercase rounded-full inline-block font-semibold text-sm">
            Etapas
          </span>

          <h2 className="text-xl sm:2xl md:text-3xl lg:text-4xl font-bold mb-8 block">
            Nossa Sequência de Passos
          </h2>

          <p className="block mb-5 md:max-w-2xl mx-auto">
            Descubra como é fácil explorar livros, criar resenhas e interagir com a comunidade em uma experiência simples e intuitiva.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {stepsData.map((step, index) => (
            <div
              key={index}
              className="shadow-lg rounded-lg overflow-hidden border-slate-200 hover:shadow-2xl transition-all duration-300 p-6 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95"
            >
              <div className="flex items-center justify-center mb-8">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-[70%] rounded-md"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="leading-6 text-slate-600 dark:text-slate-300 mb-4">{step.description}</p>
              <Link to={step.link} className="inline-block text-sm text-slate-600 dark:text-slate-300 underline font-semibold hover:text-primary transition-all">
                {step.readTime}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;