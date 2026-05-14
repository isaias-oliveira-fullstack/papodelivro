const TermsUsePage = () => {
  return (
    <section className="pb-12 space-y-6">

      {/* Header */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-lg border border-slate-200 p-8 bg-gray-200 dark:border-slate-700 dark:bg-slate-900/95">

          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-8">

            <div>
              <p>
                <strong>Última atualização:</strong> 14 de Maio de 2026
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                1. Aceitação dos Termos
              </h3>

              <p>
                Ao acessar e utilizar o Papo de Livro, o usuário concorda com os presentes Termos de Uso e com todas as condições descritas neste documento. O uso contínuo da plataforma representa a aceitação integral destas regras e diretrizes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                2. Sobre a Plataforma
              </h3>

              <p>
                O Papo de Livro é uma plataforma digital criada para leitores que desejam descobrir novos livros, compartilhar avaliações, publicar resenhas e interagir com outros apaixonados por leitura. Nosso objetivo é construir um ambiente acolhedor, acessível e colaborativo para a comunidade literária.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                3. Cadastro e Conta do Usuário
              </h3>

              <p>
                Algumas funcionalidades da plataforma exigem a criação de uma conta. Durante o cadastro, o usuário deve fornecer informações verdadeiras e atualizadas. O usuário também é responsável pela segurança de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                4. Publicação de Conteúdo
              </h3>

              <p>
                Ao publicar comentários, avaliações ou resenhas, o usuário concorda em manter um ambiente respeitoso e saudável para todos. Não é permitido publicar conteúdos ofensivos, discriminatórios, ilegais ou que violem direitos autorais e direitos de terceiros. O Papo de Livro poderá remover conteúdos inadequados sem aviso prévio.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                5. Uso da Plataforma
              </h3>

              <p>
                O usuário concorda em utilizar a plataforma de forma ética e responsável, evitando práticas que possam comprometer a segurança, estabilidade ou experiência de outros usuários. Também não é permitido utilizar automações indevidas, spam ou qualquer tentativa de acesso não autorizado ao sistema.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                6. Direitos da Plataforma
              </h3>

              <p>
                Todos os elementos do Papo de Livro, incluindo identidade visual, layout, recursos gráficos, textos e funcionalidades, são protegidos por direitos autorais e propriedade intelectual. Nenhum conteúdo da plataforma pode ser copiado ou reproduzido sem autorização.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                7. Disponibilidade do Serviço
              </h3>

              <p>
                Embora busquemos manter a plataforma disponível continuamente, poderão ocorrer interrupções temporárias devido a manutenções, atualizações ou falhas técnicas. O Papo de Livro não garante funcionamento ininterrupto do serviço.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                8. Suspensão de Conta
              </h3>

              <p>
                Contas que violem estes Termos de Uso poderão ser suspensas ou removidas permanentemente, especialmente em casos de comportamento abusivo, atividades ilegais ou violação das diretrizes da comunidade.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                9. Alterações dos Termos
              </h3>

              <p>
                Os presentes Termos de Uso poderão ser atualizados periodicamente para refletir melhorias, mudanças na plataforma ou adequações legais. Recomendamos que o usuário revise este documento regularmente.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                10. Contato
              </h3>

              <p>
                Caso tenha dúvidas sobre estes Termos de Uso, utilize os canais de suporte disponíveis na plataforma.
              </p>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default TermsUsePage;