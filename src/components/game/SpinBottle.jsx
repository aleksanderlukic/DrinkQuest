import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { randomItem, randomInt } from '../../utils/randomizer';

export default function SpinBottle({ players = [], spinMode = 'random' }) {
  const { t, isDark } = useApp();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const spinCountRef = useRef(0);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    spinCountRef.current += 1;

    const extraSpins = randomInt(2, 5) * 360;
    const finalAngle = randomInt(0, 359);
    const totalRotation = rotation + extraSpins + finalAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Pick result based on mode
      const selectedPlayer = players.length > 0 ? randomItem(players) : null;
      let action = spinMode;
      if (spinMode === 'random') {
        action = randomItem(['truth', 'dare', 'drink']);
      }
      setResult({ player: selectedPlayer, action });
    }, 3000);
  };

  const actionLabel = (action) => {
    const labels = {
      truth: { text: t('spin.truth'), emoji: '💬', color: 'text-violet-400' },
      dare: { text: t('spin.dare'), emoji: '🎯', color: 'text-pink-400' },
      drink: { text: t('spin.drink'), emoji: '🥃', color: 'text-amber-400' },
      kiss: { text: t('spin.kiss'), emoji: '💋', color: 'text-rose-400' },
    };
    return labels[action] || { text: action, emoji: '🎲', color: 'text-white' };
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Bottle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full ${isDark ? 'bg-violet-600/10' : 'bg-violet-100'}`}
        />
        <motion.div
          style={{ rotate: rotation }}
          transition={{
            duration: isSpinning ? 3 : 0,
            ease: [0.17, 0.67, 0.12, 0.99],
          }}
          className="text-7xl select-none"
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
            ? 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-500'
            : 'btn-primary'
        }`}
      >
        {isSpinning ? t('spin.spinning') : t('spin.spin')} 🌀
      </button>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`w-full rounded-2xl p-6 text-center ${
              isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200 shadow-lg'
            }`}
          >
            {result.player && (
              <p className={`text-lg font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {result.player}
              </p>
            )}
            {(() => {
              const lbl = actionLabel(result.action);
              return (
                <div>
                  <span className="text-4xl">{lbl.emoji}</span>
                  <p className={`text-sm font-bold mt-2 ${lbl.color}`}>{lbl.text}</p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
