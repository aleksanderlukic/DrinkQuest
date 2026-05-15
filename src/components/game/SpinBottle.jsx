import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { useApp } from "../../store/AppContext";
import { randomItem } from "../../utils/randomizer";

export default function SpinBottle({
  players = [],
  spinMode = "random",
  simpleMode = false,
  size = "normal",
}) {
  const { t, isDark } = useApp();
  const controls = useAnimationControls();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const currentRotation = useRef(0);
  const resultKey = useRef(0);

  const pickResult = () => {
    const selectedPlayer = players.length > 0 ? randomItem(players) : null;
    let action = spinMode;
    if (spinMode === "random") action = randomItem(["truth", "dare", "drink"]);
    resultKey.current += 1;
    setResult({ player: selectedPlayer, action });
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    if (simpleMode) {
      // Quick wobble for simple mode
      await controls.start({
        rotate: [0, -8, 8, -5, 5, 0],
        transition: { duration: 0.4, ease: "easeOut" },
      });
      pickResult();
      setIsSpinning(false);
    } else {
      // Full spinning animation
      const fullSpins = (Math.floor(Math.random() * 5) + 6) * 360;
      const finalAngle = Math.floor(Math.random() * 360);
      const totalRotation = currentRotation.current + fullSpins + finalAngle;
      currentRotation.current = totalRotation;

      await controls.start({
        rotate: totalRotation,
        transition: {
          duration: 3.2,
          ease: [0.15, 0.85, 0.3, 1],
        },
      });
      pickResult();
      setIsSpinning(false);
    }
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

  const isLarge = size === "large";

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Bottle */}
      <div
        className={`relative flex items-center justify-center ${isLarge ? "w-72 h-72" : "w-56 h-56"}`}
      >
        <div
          className={`absolute inset-0 rounded-full ${isDark ? "bg-violet-600/10" : "bg-violet-100"}`}
        />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-500 z-10" />
        <motion.div
          animate={controls}
          className={`select-none ${isLarge ? "text-[7rem]" : "text-8xl"}`}
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
        className={`px-10 rounded-2xl font-black transition-all active:scale-95 ${
          isLarge ? "py-5 text-xl" : "py-4 text-base"
        } ${
          isSpinning
            ? "opacity-50 cursor-not-allowed bg-slate-700 text-slate-500"
            : "btn-primary"
        }`}
      >
        {isSpinning ? t("spin.spinning") : t("spin.spinButton")}{" "}
        {simpleMode ? "⚡" : "🌀"}
      </button>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={resultKey.current}
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`w-full rounded-2xl text-center ${
              isLarge ? "p-8" : "p-6"
            } ${
              isDark
                ? "bg-slate-800 border border-white/10"
                : "bg-white border border-slate-200 shadow-lg"
            }`}
          >
            {result.player && (
              <p
                className={`font-black mb-2 ${isLarge ? "text-3xl" : "text-xl"} ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {result.player}
              </p>
            )}
            {(() => {
              const lbl = actionLabel(result.action);
              return (
                <p
                  className={`font-bold ${isLarge ? "text-2xl" : "text-lg"} ${lbl.color}`}
                >
                  {lbl.text}
                </p>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
