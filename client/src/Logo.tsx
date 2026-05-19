import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      state={{ section: "inicio" }}
      className="flex items-center gap-3"
    >
      <i className="lni lni-books-2 text-primary text-4xl flex items-center justify-center w-11 h-11 rounded-lg bg-white leading-none"></i>

      <div className="leading-tight">
        <h1 className="text-[1.25rem] font-semibold mb-[0.35rem] text-slate-100">
          Papo de Livro
        </h1>
        <p className="text-[0.8rem] text-slate-300">Sua biblioteca digital</p>
      </div>
    </Link>
  );
};
export default Logo;
