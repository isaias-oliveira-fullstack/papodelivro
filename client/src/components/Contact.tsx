import { useState } from "react";
import SubmitContact from "./SubmitContact";

const Contact = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "O que é a plataforma?",
      answer: [
        "É uma comunidade para leitores descobrirem novos livros, compartilharem avaliações e se conectarem com outros apaixonados por leitura.",
      ],
    },
    {
      question: "Como criar uma conta na plataforma?",
      answer: [
        "Basta clicar em “Criar conta”, preencher seus dados gratuitamente e começar sua jornada de leitura.",
      ],
    },
    {
      question: "Como posso descobrir novos livros?",
      answer: [
        "Você pode explorar diferentes categorias e encontrar livros que combinam com seu estilo de leitura.",
      ],
    },
    {
      question: "Posso avaliar e comentar os livros?",
      answer: [
        "Sim. Você pode deixar avaliações, resenhas e comentários para compartilhar sua opinião com outros leitores.",
      ],
    },
    {
      question: "Como funciona a interação com a comunidade?",
      answer: [
        "A plataforma permite que você interaja com outros leitores através de comentários, recomendações e discussões sobre livros.",
      ],
    },
    {
      question: "Receberei recomendações de livros?",
      answer: [
        "Sim. A plataforma sugere livros com base nas suas preferências e nas interações realizadas dentro da comunidade.",
      ],
    },
  ];

  return (
    <section id="contato" className="relative py-16 lg:py-24">
      <div className="max-w-auto md:max-w-7xl px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="faq pr-0 md:pr-0">
            <div className="shadow-lg rounded-lg overflow-hidden border-slate-200 hover:shadow-2xl transition-all duration-300 p-8 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95">
              <div className="section_title pb-4 mb-5">
                <span className="mb-4 lg:mb-6 px-6 py-3 bg-gray-100 text-primary uppercase rounded-full inline-block font-semibold text-sm">
                  FAQ
                </span>

                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-5">
                  Perguntas Frequentes
                </h2>

                <p>
                  O que você precisa saber para aproveitar melhor a plataforma.
                </p>
              </div>

              <div className="faq pr-0 md:pr-0">
                {faqs.map((item, index) => {
                  const isOpen = activeIndex === index;

                  return (
                    <div
                      key={index}
                      className={`single-faq ${
                        index < faqs.length - 1 &&
                        "border-b border-gray-300 mb-4 pb-2"
                      }`}
                    >
                      <h2
                        onClick={() => toggleFAQ(index)}
                        className="text-primary text-xl font-semibold mb-3 cursor-pointer flex justify-between items-center"
                      >
                        {item.question}
                        <span className="transition-transform duration-300">
                          {isOpen ? "−" : "+"}
                        </span>
                      </h2>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pb-4">
                          {item.answer.map((text, i) => (
                            <p
                              key={i}
                              className={
                                i !== item.answer.length - 1 ? "mb-4" : ""
                              }
                            >
                              {text}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="contact_wrapper mt-12 lg:mt-0">
            <div className="shadow-lg rounded-lg overflow-hidden border-slate-200 hover:shadow-2xl transition-all duration-300 p-8 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95">
              <div className="section_title pb-4">
                <span className="mb-4 lg:mb-6 px-6 py-3 bg-gray-100 text-primary uppercase rounded-full inline-block font-semibold text-sm">
                  Contato
                </span>

                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-5">
                  Entre em contato
                </h2>

                <p>
                  Tem alguma crítica, dúvida ou sugestão? Adoraríamos ouvir
                  você.
                </p>
              </div>

              <div className="contact-form">
                <SubmitContact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
