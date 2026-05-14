import useTemplateScripts from "@/hooks/useTemplateScripts";
import SubmitRegister from "@/components/SubmitRegister";

const Hero = () => {
  const { signed, navigate } = useTemplateScripts();

  return (
    <div
      id="inicio"
      className="relative overflow-hidden pt-25 pb-12 lg:pt-35 lg:pb-28 bg-primary dark:bg-dark-primary"
      data-delay="500"
    >
      <div className="absolute top-0 left-0 z-1 h-full w-full bg-[url(/assets/images/hero/default-bg.png)] bg-cover bg-center bg-no-repeat opacity-50 dark:opacity-15"></div>
      <div className="relative z-10 max-w-auto md:max-w-7xl px-4 mx-auto grid lg:grid-cols-2 items-center section">
        <img
          className="hidden lg:block"
          src="/assets/images/hero/hero-image.png"
          alt="Hero"
        />

        <div className="text-center lg:text-left lg:pl-24">
          <h2 className="text-white! text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:leading-10 xl:leading-15 xl:text-[3.5rem] font-bold">
            <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-[3rem]">
              Plataforma Social de
            </span>{" "}
            Resenhas de Livros
          </h2>

          <p className="text-slate-300! mt-2 sm:mt-4 lg:mt-6 leading-6">
            Um local onde leitores podem encontrar livros, criar resenhas,
            avaliar e interagir com outros entusiastas de livros.
          </p>

          <p className="text-slate-300! my-2 sm:my-4 lg:my-5 leading-6">
            {!signed
              ? "Crie sua conta agora e encontre sua próxima leitura favorita!"
              : "Explore novos livros, acompanhe suas leituras e revisite seus favoritos para continuar sua jornada literária."}
          </p>

          {/* 👇 Aqui está a troca */}
          {!signed ? (
            <SubmitRegister />
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-5 sm:mt-6 lg:mt-8">
              <button
                onClick={() => navigate("/livros")}
                className="rounded-full bg-white px-6 py-3 font-semibold border-2 border-transparent hover:text-white hover:border-white text-slate-900 hover:bg-transparent transition cursor-pointer"
              >
                Explorar livros
              </button>

              <button
                onClick={() => navigate("/favoritos")}
                className="rounded-full border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-slate-900 transition cursor-pointer"
              >
                Meus favoritos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
