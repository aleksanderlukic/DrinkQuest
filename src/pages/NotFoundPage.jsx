import { Link } from "react-router-dom";
import { useApp } from "../store/AppContext";

export default function NotFoundPage() {
  const { t, isDark } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-6 animate-float">🎲</div>
        <h1
          className={`text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500`}
        >
          404
        </h1>
        <h2
          className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t("notFound.title")}
        </h2>
        <p
          className={`text-sm mb-8 max-w-sm mx-auto ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {t("notFound.desc")}
        </p>
        <Link
          to="/"
          className="btn-primary text-base px-8 py-4 rounded-2xl font-black"
        >
          {t("notFound.cta")} 🏠
        </Link>
      </div>
    </div>
  );
}
