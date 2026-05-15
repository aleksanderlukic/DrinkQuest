import { useApp } from "../../store/AppContext";

export default function PlayerList({ players, onRemove, onClearAll }) {
  const { t, isDark } = useApp();

  if (!players || players.length === 0) {
    return (
      <p
        className={`text-sm italic ${isDark ? "text-slate-600" : "text-slate-400"}`}
      >
        {t("game.setup.noPlayers")}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
          <div
            key={player}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              isDark
                ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                : "bg-violet-50 text-violet-700 border border-violet-200"
            }`}
          >
            <span>{player}</span>
            <button
              onClick={() => onRemove(player)}
              className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              aria-label={`Remove ${player}`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {onClearAll && players.length > 1 && (
        <button
          onClick={onClearAll}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            isDark
              ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
              : "border-red-300 text-red-500 hover:bg-red-50"
          }`}
        >
          🗑 {t("game.setup.clearAll")}
        </button>
      )}
    </div>
  );
}
