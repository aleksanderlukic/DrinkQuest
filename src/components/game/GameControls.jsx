import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../store/AppContext";

export default function GameControls({
  onNext,
  onReset,
  onSkip,
  skipPenaltyEnabled = false,
  modes = [],
  activeMode,
  onModeChange,
}) {
  const { t, isDark } = useApp();
  const [showPenalty, setShowPenalty] = useState(false);
  const [penaltySips, setPenaltySips] = useState(0);

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

  const handleSkipClick = useCallback(() => {
    if (skipPenaltyEnabled) {
      const sips = Math.floor(Math.random() * 4) + 1;
      setPenaltySips(sips);
      setShowPenalty(true);
      setTimeout(() => {
        setShowPenalty(false);
        onSkip?.();
      }, 2200);
    } else {
      onSkip?.();
    }
  }, [skipPenaltyEnabled, onSkip]);

  return (
    <>
      {/* Penalty Overlay */}
      <AnimatePresence>
        {showPenalty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-10 text-center shadow-2xl mx-6"
            >
              <p className="text-7xl mb-4">🥃</p>
              <p className="text-white font-black text-3xl mb-1">
                {t("game.play.penaltyTitle")}
              </p>
              <p className="text-amber-100 font-bold text-xl">
                {t("game.play.penaltyDrink", { count: penaltySips })}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
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

        {/* Next + Reset */}
        <div className="flex gap-3">
          <button
            onClick={() => onNext()}
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

        {/* Skip button */}
        {onSkip && (
          <button
            onClick={handleSkipClick}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 border border-dashed ${
              isDark
                ? "border-white/15 text-slate-500 hover:text-slate-300 hover:border-white/30"
                : "border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400"
            }`}
          >
            ⏭ {t("game.play.skip")}
            {skipPenaltyEnabled && (
              <span className="ml-2 text-amber-500 text-xs">🥃</span>
            )}
          </button>
        )}
      </div>
    </>
  );
}
