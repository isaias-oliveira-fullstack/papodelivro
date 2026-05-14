import SubmitRegister from "@/components/SubmitRegister";

const RegisterPage = () => {
  return (
    <section className="flex min-h-[74.5vh] items-center justify-center">
      <div className="mx-auto w-full max-w-xl rounded-lg border p-8 shadow-sm relative overflow-hidden bg-primary dark:bg-dark-primary">
        <div className="absolute top-0 left-0 z-1 h-full w-full bg-[url(/assets/images/hero/default-bg.png)] bg-cover bg-center bg-no-repeat opacity-70 dark:opacity-20"></div>
        <div className="relative z-10">
          <div className="space-y-4 mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300!">
            Cadastro
          </p>
          <h2 className="text-3xl font-semibold text-slate-100!">
            Crie sua conta
          </h2>
          </div>
          <SubmitRegister />
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
