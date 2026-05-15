import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { useApp } from "../../store/AppContext";
import { randomItem } from "../../utils/randomizer";

export default function SpinBottle({ players = [], spinMode = "random" }) {
  const { t, isDark } = useApp();
  const controls = useAnimationControls();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const currentRotation = useRef(0);

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // 6–10 full rotations + random final angle for natural landing
    const fullSpins = (Math.floor(Math.random() * 5) + 6) * 360;
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = currentRotation.current + fullSpins + finalAngle;
    currentRotation.current = totalRotation;

    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 3.2,
        ease: [0.15, 0.85, 0.3, 1], // fast spin-up → smooth ease-out landing
      },
    });

    // Pick result after animation completes
    const selectedPlayer = players.length > 0 ? randomItem(players) : null;
    let action = spinMode;
    if (spinMode === "random") {
      action = randomItem(["truth", "dare", "drink"]);
    }
    setResult({ player: selectedPlayer, action });
    setIsSpinning(false);
  };

  const actionLabel = (action) => {
    const labels = {
      truth: { text: t("spin.modes.truth"), color: "text-violet-400" },
      dare: { text: t("spin.modes.dare"), color: "text-pink-400" },
      drink: { text: "Drink 🥃", color: "text-amber-400" },
      kiss: { text: t("spin.modes.kiss"), color: "text-rose-400" },
    };
    return labels[action] || { text: action, color: "text-white" };
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Bottle */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full ${isDark ? "bg-violet-600/10" : "bg-violet-100"}`}
        />
        {/* Pointer marker at top */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-500 z-10" />
        <motion.div
          animate={controls}
          className="text-8xl select-none"
          role="img"
          aria-label="Spinning bottle"
        >
          🍾
        </motion.div>
      </div>

      {/* Spin button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`px-10 py-4 rounded-2xl font-black text-base transition-all active:scale-95 ${
          isSpinning
            ? "opacity-50 cursor-not-allowed bg-slate-700 text-slate-500"
            : "btn-primary"
        }`}
      >
        {isSpinning ? t("spin.spinning") : t("spin.spinButton")} 🌀
      </button>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={currentRotation.current}
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`w-full rounded-2xl p-6 text-center ${
              isDark
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200 shadow-lg"
            }`}
          >
            {result.player && (
              <p
                className={`text-xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {result.player}
              </p>
            )}
            {(() => {
              const lbl = actionLabel(result.action);
              return (
                <p className={`text-lg font-bold ${lbl.color}`}>{lbl.text}</p>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
