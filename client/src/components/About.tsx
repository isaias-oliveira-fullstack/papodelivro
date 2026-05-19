import useTemplateScripts from "@/hooks/useTemplateScripts";
import { Button } from "@/components/ui/button";

const About = () => {
  const { navigate } = useTemplateScripts();

  return (
    <section id="sobre">
      <div className="bg-gray-200 py-24 transition dark:bg-slate-900/95">
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center">
          <div className="image overflow-hidden lg:pr-10">
            <img
              className="rounded-xl"
              src="/assets/images/about/about-image.png"
              alt="Sobre - Conectando leitores, ideias e histórias em um só lugar."
            />
          </div>
          <div className="content lg:pr-25">
            <span className="mb-4 lg:mb-6 px-6 py-3 bg-gray-100 text-primary uppercase rounded-full inline-block font-semibold text-sm">
              Sobre
            </span>
            <h2 className="text-xl sm:2xl md:text-3xl lg:text-4xl font-bold mb-8 block text-slate-950 dark:text-white">
              Conectando leitores, ideias e histórias em um só lugar
            </h2>
            <p className="block mb-5 text-slate-950 dark:text-slate-300 leading-6 font-semibold">
              O Papo de Livro é um espaço onde você acompanha sua jornada de
              leitura, registra suas experiências e descobre novas histórias.
            </p>
            <p className="block mb-6 text-slate-600 dark:text-slate-300 leading-6">
              Explore livros, revisite seu histórico, organize seus favoritos e
              conecte-se com outros leitores em um ambiente colaborativo feito
              para quem ama ler.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/sobre")}
                className="inline-block bg-primary px-7 h-12 font-semibold rounded-lg text-white border-2 border-primary transition-all hover:bg-transparent hover:text-primary hover:border-primary dark:hover:border-white dark:hover:text-white cursor-pointer"
              >
                Saiba mais
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/livros")}
                className="inline-block border-2 bg-transparent border-primary dark:border-white px-7 h-12 font-semibold rounded-lg text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-slate-900 cursor-pointer"
              >
                Explorar livros
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default About;
