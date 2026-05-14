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

            <div>
              <p>
                <strong>Última atualização:</strong> 14 de Maio de 2026
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                1. Compromisso com a Privacidade
              </h3>

              <p>
                O Papo de Livro valoriza a privacidade e a segurança das informações dos usuários. Esta Política de Privacidade explica como os dados são coletados, utilizados e protegidos dentro da plataforma.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                2. Coleta de Informações
              </h3>

              <p>
                Durante o uso da plataforma, algumas informações poderão ser coletadas para melhorar a experiência do usuário e garantir o funcionamento adequado dos serviços. Isso pode incluir dados de cadastro, informações de autenticação, preferências de leitura, avaliações publicadas, favoritos e interações realizadas dentro da comunidade.
              </p>

              <p className="mt-4">
                Também podem ser coletadas informações técnicas, como navegador utilizado, dispositivo, endereço IP e dados de navegação, com o objetivo de melhorar desempenho, segurança e estabilidade da plataforma.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                3. Uso das Informações
              </h3>

              <p>
                As informações coletadas são utilizadas para personalizar a experiência do usuário, recomendar conteúdos relevantes, permitir funcionalidades da plataforma e garantir segurança durante o acesso e utilização do sistema.
              </p>

              <p className="mt-4">
                Além disso, os dados podem ser utilizados para melhorias internas, análises de desempenho e desenvolvimento de novos recursos.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                4. Compartilhamento de Dados
              </h3>

              <p>
                O Papo de Livro não vende informações pessoais dos usuários. Os dados poderão ser compartilhados apenas quando necessário para funcionamento técnico da plataforma, cumprimento de obrigações legais ou proteção da segurança dos usuários e do sistema.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                5. Cookies e Tecnologias Semelhantes
              </h3>

              <p>
                A plataforma poderá utilizar cookies e tecnologias semelhantes para melhorar a navegação, salvar preferências e oferecer uma experiência mais personalizada. O usuário pode desativar cookies diretamente nas configurações do navegador, embora isso possa afetar algumas funcionalidades.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                6. Segurança das Informações
              </h3>

              <p>
                Adotamos medidas de segurança para proteger os dados contra acessos não autorizados, perda, alteração ou divulgação indevida. Apesar dos esforços de proteção, nenhum sistema é totalmente livre de riscos.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                7. Direitos do Usuário
              </h3>

              <p>
                O usuário poderá solicitar atualização, correção ou exclusão de informações pessoais vinculadas à sua conta, conforme permitido pela legislação aplicável.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                8. Links Externos
              </h3>

              <p>
                O Papo de Livro poderá conter links para plataformas ou serviços externos. Não somos responsáveis pelas práticas de privacidade adotadas por terceiros.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                9. Atualizações desta Política
              </h3>

              <p>
                Esta Política de Privacidade poderá ser modificada periodicamente para refletir melhorias, mudanças legais ou atualizações na plataforma. Recomendamos que o usuário revise este documento regularmente.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                10. Contato
              </h3>

              <p>
                Caso tenha dúvidas sobre esta Política de Privacidade ou sobre o tratamento de dados, utilize os canais de suporte disponíveis na plataforma.
              </p>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default PrivacyPolicyPage;