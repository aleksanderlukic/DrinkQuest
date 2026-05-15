import { Link } from "react-router-dom";
import { useApp } from "../../store/AppContext";

export default function Footer() {
  const { t, isDark } = useApp();

  const gameLinks = [
    { path: "/games/truth-or-dare", label: t("games.truthOrDare.title") },
    {
      path: "/games/never-have-i-ever",
      label: t("games.neverHaveIEver.title"),
    },
    { path: "/games/spin-the-bottle", label: t("games.spinTheBottle.title") },
    { path: "/games/most-likely-to", label: t("games.mostLikelyTo.title") },
  ];

  const createLinks = [
    { path: "/custom", label: t("nav.custom") },
    { path: "/generator", label: t("nav.generator") },
    { path: "/favorites", label: t("nav.favorites") },
    { path: "/settings", label: t("nav.settings") },
  ];

  return (
    <footer
      className={`mt-24 border-t ${
        isDark ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎲</span>
              <span
                className={`font-black text-xl ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Drink
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500">
                  Quest
                </span>
              </span>
            </Link>
            <p
              className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"}`}
            >
              {t("footer.tagline")}
            </p>
          </div>

          {/* Play links */}
          <div>
            <h4
              className={`font-semibold text-sm uppercase tracking-wider mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("footer.sections.play")}
            </h4>
            <ul className="space-y-2">
              {gameLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-500 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Create links */}
          <div>
            <h4
              className={`font-semibold text-sm uppercase tracking-wider mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("footer.sections.create")}
            </h4>
            <ul className="space-y-2">
              {createLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-500 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? "border-white/5" : "border-slate-200"}`}
        >
          <p
            className={`text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}
          >
            {t("footer.copyright")}
          </p>
          <p
            className={`text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}
          >
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
