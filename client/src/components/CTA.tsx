import useTemplateScripts from "@/hooks/useTemplateScripts";

const CTA = () => {
  const { navigate } = useTemplateScripts();
  return (
    <section
      id="cta"
      className="py-20 lg:py-25 relative bg-gray-200 dark:bg-slate-900/95"
    >
      <div className="container">
          <div className="max-w-auto md:max-w-7xl px-4 mx-auto sm:px-20 md:px-30 lg:px-80 text-center">
          <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-8">
            Pronto para contribuir {" "}
            <span className="block"> 
              com a {" "}
              <span className="font-black! text-primary text-xl md:text-2xl lg:text-3xl uppercase">
                comunidade?
              </span>
            </span>
          </h2>

          <p className="leading-6 mb-10">
            Envie sua primeira resenha ou avalie um livro que você já leu e ajude outros leitores a descobrir novas histórias incríveis e inspiradoras.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5 sm:mt-6 lg:mt-8">
              <button
                onClick={() => navigate("/livros")}
                className="inline-block bg-primary px-7 py-3 font-medium rounded-full text-white border-2 border-transparent transition-all hover:bg-transparent hover:text-primary hover:border-primary dark:hover:border-white dark:hover:text-white cursor-pointer"
              >
                Explorar livros
              </button>

              <button
                onClick={() => navigate("/favoritos")}
                className="inline-block border-2 border-primary dark:border-white px-7 py-3 font-medium rounded-full text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-slate-900 cursor-pointer"
              >
                Meus favoritos
              </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;