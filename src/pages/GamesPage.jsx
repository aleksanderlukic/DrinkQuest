import { useState } from "react";
import { useApp } from "../store/AppContext";
import { gamesList } from "../data/gamesList";
import GameCard from "../components/common/GameCard";

export default function GamesPage() {
  const { t, isDark } = useApp();
  const [filter, setFilter] = useState("all");

  const categories = ["all", "Classic", "Drinking", "Group", "Couples"];

  const filtered =
    filter === "all"
      ? gamesList
      : gamesList.filter((g) => g.categoryKey === filter);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className={`text-4xl font-black mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t("games.title")}
          </h1>
          <p
            className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {t("games.subtitle")}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                filter === cat
                  ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg"
                  : isDark
                    ? "bg-white/10 text-slate-300 hover:bg-white/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
