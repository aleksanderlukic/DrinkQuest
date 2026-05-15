import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../store/AppContext";
import FavoriteButton from "./FavoriteButton";

export default function GameCard({ game, index = 0 }) {
  const { t, isDark } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group relative rounded-2xl overflow-hidden card-hover ${
        isDark
          ? "bg-slate-900 border border-white/5 hover:border-violet-500/30"
          : "bg-white border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-lg"
      }`}
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${game.gradient}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${game.gradient} bg-opacity-10`}
          >
            {game.emoji}
          </div>
          <FavoriteButton gameId={game.id} />
        </div>

        {/* Title & desc */}
        <h3
          className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t(game.titleKey)}
        </h3>
        <p
          className={`text-xs leading-relaxed mb-4 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {t(game.shortDescKey)}
        </p>

        {/* Play button */}
        <Link
          to={game.path}
          className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 bg-gradient-to-r ${game.gradient} text-white opacity-90 hover:opacity-100 shadow-md`}
        >
          {t("games.play")} →
        </Link>
      </div>
    </motion.div>
  );
}
