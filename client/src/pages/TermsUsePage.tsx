const termsContent = [
  {
    type: "update",
    text: "14 de Maio de 2026",
  },
  {
    type: "section",
    title: "1. Aceitação dos Termos",
    paragraphs: [
      "Ao acessar e utilizar o Papo de Livro, o usuário concorda com os presentes Termos de Uso e com todas as condições descritas neste documento. O uso contínuo da plataforma representa a aceitação integral destas regras e diretrizes.",
    ],
  },
  {
    type: "section",
    title: "2. Sobre a Plataforma",
    paragraphs: [
      "O Papo de Livro é uma plataforma digital criada para leitores que desejam descobrir novos livros, compartilhar avaliações, publicar resenhas e interagir com outros apaixonados por leitura. Nosso objetivo é construir um ambiente acolhedor, acessível e colaborativo para a comunidade literária.",
    ],
  },
  {
    type: "section",
    title: "3. Cadastro e Conta do Usuário",
    paragraphs: [
      "Algumas funcionalidades da plataforma exigem a criação de uma conta. Durante o cadastro, o usuário deve fornecer informações verdadeiras e atualizadas. O usuário também é responsável pela segurança de suas credenciais de acesso e por todas as atividades realizadas em sua conta.",
    ],
  },
  {
    type: "section",
    title: "4. Publicação de Conteúdo",
    paragraphs: [
      "Ao publicar comentários, avaliações ou resenhas, o usuário concorda em manter um ambiente respeitoso e saudável para todos. Não é permitido publicar conteúdos ofensivos, discriminatórios, ilegais ou que violem direitos autorais e direitos de terceiros. O Papo de Livro poderá remover conteúdos inadequados sem aviso prévio.",
    ],
  },
  {
    type: "section",
    title: "5. Uso da Plataforma",
    paragraphs: [
      "O usuário concorda em utilizar a plataforma de forma ética e responsável, evitando práticas que possam comprometer a segurança, estabilidade ou experiência de outros usuários. Também não é permitido utilizar automações indevidas, spam ou qualquer tentativa de acesso não autorizado ao sistema.",
    ],
  },
  {
    type: "section",
    title: "6. Direitos da Plataforma",
    paragraphs: [
      "Todos os elementos do Papo de Livro, incluindo identidade visual, layout, recursos gráficos, textos e funcionalidades, são protegidos por direitos autorais e propriedade intelectual. Nenhum conteúdo da plataforma pode ser copiado ou reproduzido sem autorização.",
    ],
  },
  {
    type: "section",
    title: "7. Disponibilidade do Serviço",
    paragraphs: [
      "Embora busquemos manter a plataforma disponível continuamente, poderão ocorrer interrupções temporárias devido a manutenções, atualizações ou falhas técnicas. O Papo de Livro não garante funcionamento ininterrupto do serviço.",
    ],
  },
  {
    type: "section",
    title: "8. Suspensão de Conta",
    paragraphs: [
      "Contas que violem estes Termos de Uso poderão ser suspensas ou removidas permanentemente, especialmente em casos de comportamento abusivo, atividades ilegais ou violação das diretrizes da comunidade.",
    ],
  },
  {
    type: "section",
    title: "9. Alterações dos Termos",
    paragraphs: [
      "Os presentes Termos de Uso poderão ser atualizados periodicamente para refletir melhorias, mudanças na plataforma ou adequações legais. Recomendamos que o usuário revise este documento regularmente.",
    ],
  },
  {
    type: "section",
    title: "10. Contato",
    paragraphs: [
      "Caso tenha dúvidas sobre estes Termos de Uso, utilize os canais de suporte disponíveis na plataforma.",
    ],
  },
] as const;

const TermsUsePage = () => {
  return (
    <section className="pb-12 space-y-6">
      <div className="bg-gray-200 py-6 transition dark:bg-slate-900/95 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Termos de Uso
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Regras de utilização da plataforma.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-lg border border-slate-200 p-8 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95">
          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-8">
            {termsContent.map((item, index) => {
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

                    {item.paragraphs.map((paragraph) => (
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

export default TermsUsePage;
