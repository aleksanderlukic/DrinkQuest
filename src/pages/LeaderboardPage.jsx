import { useState, useMemo } from "react";
import { useApp } from "../store/AppContext";

export default function LeaderboardPage() {
  const { t, isDark, players: globalPlayers } = useApp();

  // Local player list so users can add/remove without affecting other games
  const [localPlayers, setLocalPlayers] = useState(() => [...(globalPlayers || [])]);
  const [newName, setNewName] = useState("");

  // drinks[playerName] = count
  const [drinks, setDrinks] = useState(() =>
    Object.fromEntries((globalPlayers || []).map((p) => [p, 0])),
  );
  const [points, setPoints] = useState(() =>
    Object.fromEntries((globalPlayers || []).map((p) => [p, 0])),
  );
  const [activeTab, setActiveTab] = useState("drinks"); // drinks | points

  const setScores = activeTab === "drinks" ? setDrinks : setPoints;

  const ranking = useMemo(() => {
    const names = [
      ...new Set([...localPlayers, ...Object.keys(drinks), ...Object.keys(points)]),
    ];
    const scores = activeTab === "drinks" ? drinks : points;
    return names
      .map((name) => ({
        name,
        drinks: drinks[name] || 0,
        points: points[name] || 0,
        score: scores[name] || 0,
      }))
      .sort((a, b) => b.score - a.score);
  }, [localPlayers, drinks, points, activeTab]);

  const addLocalPlayer = () => {
    const trimmed = newName.trim();
    if (!trimmed || localPlayers.includes(trimmed)) return;
    setLocalPlayers((prev) => [...prev, trimmed]);
    setDrinks((prev) => ({ ...prev, [trimmed]: 0 }));
    setPoints((prev) => ({ ...prev, [trimmed]: 0 }));
    setNewName("");
  };

  const removeLocalPlayer = (name) => {
    setLocalPlayers((prev) => prev.filter((p) => p !== name));
    setDrinks((prev) => { const next = { ...prev }; delete next[name]; return next; });
    setPoints((prev) => { const next = { ...prev }; delete next[name]; return next; });
  };

  const clearAll = () => {
    setLocalPlayers([]);
    setDrinks({});
    setPoints({});
  };

  const change = (name, delta) => {
    setScores((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta),
    }));
  };

  const resetScores = () => {
    if (activeTab === "drinks") {
      setDrinks(Object.fromEntries(ranking.map((r) => [r.name, 0])));
    } else {
      setPoints(Object.fromEntries(ranking.map((r) => [r.name, 0])));
    }
  };

  const medals = ["🥇", "🥈", "🥉"];

  const tabBtn = (key, label) => (
    <button
      onClick={() => setActiveTab(key)}
      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
        activeTab === key
          ? "bg-violet-600 text-white"
          : isDark
            ? "text-slate-400 hover:text-white"
            : "text-slate-500 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h1
            className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t("leaderboard.title")}
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {t("leaderboard.subtitle")}
          </p>
        </div>

        {/* Add player */}
        <div
          className={`rounded-2xl p-4 ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-slate-200 shadow-sm"}`}
        >
          <p className={`text-xs font-semibold mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {t("leaderboard.addPlayer")}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLocalPlayer()}
              placeholder={t("game.setup.playerNamePlaceholder")}
              className={`flex-1 px-4 py-2 rounded-xl text-sm outline-none border ${
                isDark
                  ? "bg-white/10 border-white/10 text-white placeholder-slate-500 focus:border-violet-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-400"
              }`}
            />
            <button
              onClick={addLocalPlayer}
              disabled={!newName.trim()}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold disabled:opacity-40 hover:bg-violet-500 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`flex gap-2 p-1 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-100"}`}
        >
          {tabBtn("drinks", `🍺 ${t("leaderboard.drinks")}`)}
          {tabBtn("points", `⭐ ${t("leaderboard.points")}`)}
        </div>

        {/* Ranking list */}
        {ranking.length === 0 ? (
          <div
            className={`rounded-3xl p-8 text-center ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            <p
              className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              {t("leaderboard.noPlayers")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {ranking.map((entry, i) => {
              return (
                <div
                  key={entry.name}
                  className={`flex items-center gap-4 p-4 rounded-2xl ${
                    i === 0
                      ? isDark
                        ? "bg-amber-500/20 border border-amber-500/30"
                        : "bg-amber-50 border border-amber-200"
                      : isDark
                        ? "bg-slate-900 border border-white/10"
                        : "bg-white border border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Rank */}
                  <span className="text-xl w-8 text-center flex-shrink-0">
                    {medals[i] ?? `${i + 1}`}
                  </span>

                  {/* Name */}
                  <span
                    className={`flex-1 font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {entry.name}
                  </span>

                  {/* Score counter */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => change(entry.name, -1)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-lg transition-colors ${
                        isDark
                          ? "bg-white/10 text-slate-300 hover:bg-white/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      −
                    </button>
                    <span
                      className={`w-8 text-center text-lg font-black ${
                        i === 0
                          ? "text-amber-500"
                          : isDark
                            ? "text-white"
                            : "text-slate-900"
                      }`}
                    >
                      {entry.score}
                    </span>
                    <button
                      onClick={() => change(entry.name, 1)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-lg transition-colors ${
                        isDark
                          ? "bg-violet-600/30 text-violet-300 hover:bg-violet-600/50"
                          : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                      }`}
                    >
                      +
                    </button>
                    {/* Remove player */}
                    <button
                      onClick={() => removeLocalPlayer(entry.name)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ml-1 ${
                        isDark
                          ? "bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400"
                          : "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      }`}
                      title="Remove player"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        {ranking.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={resetScores}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition-colors ${
                isDark
                  ? "border-slate-700 text-slate-400 hover:bg-white/5"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              🔄 {t("leaderboard.reset")}
            </button>
            <button
              onClick={clearAll}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition-colors ${
                isDark
                  ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  : "border-red-300 text-red-500 hover:bg-red-50"
              }`}
            >
              🗑 {t("leaderboard.clearAll")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
