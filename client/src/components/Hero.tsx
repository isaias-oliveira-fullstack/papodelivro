import { useState, useEffect } from "react";
import useTemplateScripts from "@/hooks/useTemplateScripts";
import SubmitRegister from "@/components/SubmitRegister";
import { Button } from "@/components/ui/button";

const imgSlide = [
  { img: "/assets/images/hero/hero-image.png", alt: "Início" },
  { img: "/assets/images/steps/step-1.png", alt: "Início" },
  { img: "/assets/images/steps/step-2.png", alt: "Sobre" },
  { img: "/assets/images/steps/step-3.png", alt: "Etapas" },
  { img: "/assets/images/steps/step-4.png", alt: "Biblioteca" },
];

const Hero = () => {
  const { signed, navigate } = useTemplateScripts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageLoaded) return;

    const timeout = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % imgSlide.length);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [currentSlide, imageLoaded]);

  return (
    <div
      id="inicio"
      className="relative overflow-hidden pt-25 pb-12 lg:pt-35 lg:pb-28 bg-primary dark:bg-dark-primary"
    >
      <div className="absolute top-0 left-0 z-1 h-full w-full bg-[url(/assets/images/hero/default-bg.png)] bg-cover bg-center bg-no-repeat opacity-50 dark:opacity-15"></div>

      <div className="relative z-10 max-w-auto md:max-w-7xl px-4 mx-auto grid lg:grid-cols-2 items-center section">

        
        <div className="relative w-full h-120 hidden lg:flex items-center justify-center">
          {!imageLoaded && (
            <div className="absolute w-full flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

              <p className="text-slate-100! text-sm tracking-wide">
                Carregando imagens...
              </p>
            </div>
          )}
          
          {imgSlide.map((slide, index) => (
            <img
              key={index}
              src={slide.img}
              alt={slide.alt}
              onLoad={() => {
                if (index === 0) {
                  setImageLoaded(true);
                }
              }}
              className={`
                absolute
                w-auto
                h-120
                transition-all
                duration-700
                ease-in-out
                ${
                  index === currentSlide && imageLoaded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }
              `}
            />
          ))}
        </div>

        {/* Conteúdo */}
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

          {!signed ? (
            <SubmitRegister />
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-5 sm:mt-6 lg:mt-8">
              <Button
                onClick={() => navigate("/livros")}
                className="rounded-lg bg-white px-6 h-12 font-semibold border-2 border-white hover:text-white text-primary hover:bg-transparent transition cursor-pointer"
              >
                Explorar livros
              </Button>

              <Button
                onClick={() => navigate("/favoritos")}
                className="rounded-lg border-2 border-white px-6 h-12 font-semibold text-white bg-transparent hover:bg-white hover:text-primary transition cursor-pointer"
              >
                Meus favoritos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;