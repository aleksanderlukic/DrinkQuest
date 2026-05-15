import { Link } from "react-router-dom";
import { useApp } from "../../store/AppContext";

export default function CTASection() {
  const { t } = useApp();

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative rounded-3xl overflow-hidden p-12 bg-gradient-to-br from-violet-600 to-pink-600 shadow-2xl shadow-violet-500/30">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-4 left-8 text-5xl">🎉</div>
            <div className="absolute bottom-4 right-8 text-4xl">🥂</div>
            <div className="absolute top-8 right-12 text-3xl">✨</div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">
              {t("home.cta.title")}
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              {t("home.cta.subtitle")}
            </p>
            <Link
              to="/games"
              className="inline-block px-10 py-4 rounded-2xl font-black text-base bg-white text-violet-700 hover:bg-violet-50 transition-all active:scale-95 shadow-xl"
            >
              {t("home.cta.button")} 🚀
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
