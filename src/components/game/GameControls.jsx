import { useApp } from "../../store/AppContext";

export default function GameControls({
  onNext,
  onReset,
  modes = [],
  activeMode,
  onModeChange,
}) {
  const { t, isDark } = useApp();

  const modeConfig = {
    truth: {
      label: t("game.play.truth"),
      emoji: "💬",
      color: "from-violet-600 to-purple-700",
    },
    dare: {
      label: t("game.play.dare"),
      emoji: "🎯",
      color: "from-pink-600 to-rose-700",
    },
    random: {
      label: t("game.play.random"),
      emoji: "🎲",
      color: "from-amber-500 to-orange-600",
    },
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      {modes.length > 0 && (
        <div className="flex gap-2">
          {modes.map((mode) => {
            const cfg = modeConfig[mode] || {
              label: mode,
              emoji: "🎮",
              color: "from-slate-500 to-slate-600",
            };
            const active = activeMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onModeChange?.(mode)}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                  active
                    ? `bg-gradient-to-r ${cfg.color} text-white shadow-lg`
                    : isDark
                      ? "bg-white/10 text-slate-300 hover:bg-white/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cfg.emoji} {cfg.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          className="flex-[3] py-4 rounded-2xl font-black text-base btn-primary active:scale-95 transition-all"
        >
          {t("game.play.next")} →
        </button>
        <button
          onClick={onReset}
          className={`flex-1 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all ${
            isDark
              ? "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
          }`}
        >
          {t("game.play.reset")}
        </button>
      </div>
    </div>
  );
}
