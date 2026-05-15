import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../store/AppContext";
import PlayerInput from "../components/game/PlayerInput";
import PlayerList from "../components/game/PlayerList";
import SpinBottle from "../components/game/SpinBottle";

const MODES = ["random", "truth", "dare", "drink"];

export default function SpinTheBottlePage() {
  const { t, isDark, players, addPlayer, removePlayer, clearPlayers } =
    useApp();
  const [spinMode, setSpinMode] = useState("random");
  const [simpleMode, setSimpleMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const modeLabels = {
    random: { label: t("spin.modes.random") },
    truth: { label: t("spin.modes.truth") },
    dare: { label: t("spin.modes.dare") },
    drink: { label: "Drink 🥃" },
  };

  return (
    <>
      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFullscreen(false);
            }}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-5 right-5 text-white/60 hover:text-white text-3xl leading-none"
            >
              ✕
            </button>
            <div className="w-full max-w-md">
              <SpinBottle
                players={players}
                spinMode={spinMode}
                simpleMode={simpleMode}
                size="large"
              />
            </div>
            <p className="mt-6 text-white/30 text-xs">Tap ✕ to close</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🍾</div>
            <h1
              className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.spinTheBottle.title")}
            </h1>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("games.spinTheBottle.description")}
            </p>
          </div>

          <div
            className={`rounded-3xl p-6 space-y-6 mb-6 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            {/* Players */}
            <div>
              <h3
                className={`font-bold text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {t("game.setup.players")}
              </h3>
              <PlayerInput onAdd={addPlayer} />
              <div className="mt-3">
                <PlayerList
                  players={players}
                  onRemove={removePlayer}
                  onClearAll={clearPlayers}
                />
              </div>
            </div>

            {/* Spin mode */}
            <div>
              <h3
                className={`font-bold text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {t("spin.mode")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map((m) => {
                  const cfg = modeLabels[m];
                  const active = spinMode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setSpinMode(m)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        active
                          ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg"
                          : isDark
                            ? "bg-white/10 text-slate-300 hover:bg-white/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animation mode toggle */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {simpleMode ? "⚡ Simple mode" : "🌀 Animated mode"}
                </p>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {simpleMode
                    ? "Instant result, no animation"
                    : "Full spin animation"}
                </p>
              </div>
              <button
                onClick={() => setSimpleMode((p) => !p)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${simpleMode ? "bg-violet-600" : isDark ? "bg-white/20" : "bg-slate-300"}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${simpleMode ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          {/* Spin component */}
          <div
            className={`rounded-3xl p-8 relative ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            {/* Fullscreen button */}
            <button
              onClick={() => setIsFullscreen(true)}
              title="Fullscreen"
              className={`absolute top-4 right-4 text-sm px-3 py-1.5 rounded-xl font-semibold transition-all active:scale-95 ${isDark ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              ⛶ Fullscreen
            </button>
            <SpinBottle
              players={players}
              spinMode={spinMode}
              simpleMode={simpleMode}
            />
          </div>
        </div>
      </div>
    </>
  );
}
