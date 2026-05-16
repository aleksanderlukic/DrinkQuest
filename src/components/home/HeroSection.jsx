import { Link } from "react-router-dom";
import { useApp } from "../../store/AppContext";

export default function HeroSection() {
  const { t, isDark } = useApp();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-br from-violet-950 via-slate-950 to-pink-950"
            : "bg-gradient-to-br from-violet-100 via-white to-pink-100"
        }`}
      />

      {/* Decorative blobs */}
      <div
        className={`absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-violet-600/20" : "bg-violet-300/30"
        }`}
      />
      <div
        className={`absolute bottom-20 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-pink-600/20" : "bg-pink-300/30"
        }`}
      />

      {/* Floating emojis */}
      <div
        className={`absolute top-1/4 left-8 text-4xl animate-float select-none pointer-events-none ${isDark ? "opacity-20" : "opacity-30"}`}
      >
        🎉
      </div>
      <div
        className={`absolute top-1/3 right-10 text-3xl animate-float select-none pointer-events-none ${isDark ? "opacity-20" : "opacity-30"}`}
        style={{ animationDelay: "0.8s" }}
      >
        🥂
      </div>
      <div
        className={`absolute bottom-1/3 left-16 text-2xl animate-float select-none pointer-events-none ${isDark ? "opacity-20" : "opacity-30"}`}
        style={{ animationDelay: "1.4s" }}
      >
        🎲
      </div>
      <div
        className={`absolute bottom-1/4 right-12 text-3xl animate-float select-none pointer-events-none ${isDark ? "opacity-20" : "opacity-30"}`}
        style={{ animationDelay: "0.4s" }}
      >
        🃏
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${
            isDark
              ? "bg-violet-600/20 border border-violet-500/30 text-violet-300"
              : "bg-violet-100 border border-violet-300 text-violet-700"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${isDark ? "bg-violet-400" : "bg-violet-500"}`}
          />
          {t("home.hero.badge")}
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {t("home.hero.title")}
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-500">
            {t("home.hero.titleHighlight")}
          </span>
        </h1>

        <p
          className={`text-lg max-w-xl mx-auto mb-10 leading-relaxed ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {t("home.hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/games"
            className="px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all active:scale-95"
          >
            {t("home.hero.ctaPrimary")} 🎮
          </Link>
          <Link
            to="/games"
            className={`px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 ${
              isDark
                ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                : "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-md"
            }`}
          >
            {t("home.hero.ctaSecondary")}
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-16">
          {[
            { value: "8", label: "Game Modes" },
            { value: "500+", label: "Questions" },
            { value: "2", label: "Languages" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {s.value}
              </div>
              <div
                className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
