const privacyContent = [
  {
    type: "update",
    text: "14 de Maio de 2026",
  },
  {
    type: "section",
    title: "1. Compromisso com a Privacidade",
    paragraphs: [
      "O Papo de Livro valoriza a privacidade e a segurança das informações dos usuários. Esta Política de Privacidade explica como os dados são coletados, utilizados e protegidos dentro da plataforma.",
    ],
  },
  {
    type: "section",
    title: "2. Coleta de Informações",
    paragraphs: [
      "Durante o uso da plataforma, algumas informações poderão ser coletadas para melhorar a experiência do usuário e garantir o funcionamento adequado dos serviços.",

      "Também podem ser coletadas informações técnicas, como navegador utilizado, dispositivo, endereço IP e dados de navegação.",
    ],
  },
  {
    type: "section",
    title: "3. Uso das Informações",
    paragraphs: [
      "As informações coletadas são utilizadas para personalizar a experiência do usuário.",

      "Além disso, os dados podem ser utilizados para melhorias internas e desenvolvimento de novos recursos.",
    ],
  },
] as const;

const PrivacyPolicyPage = () => {
  return (
    <section className="pb-12 space-y-6">
      {/* Header */}
      <div className="bg-gray-200 py-6 transition dark:bg-slate-900/95 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Política de Privacidade
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Como protegemos seus dados.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-lg border border-slate-200 p-8 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95">
          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-8">
            {privacyContent.map((item, index) => {
              if (item.type === "update") {
                return (
                  <div key={index}>
                    <p>
                      <strong>Última atualização:</strong> {item.text}
                    </p>
                  </div>
                );
              }

              if (item.type === "section") {
                return (
                  <div key={index}>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>

                    {item.paragraphs.map((paragraph,) => (
                      <p key={paragraph} className="mt-4 first:mt-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                );
              }

              return null;
            })}

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
