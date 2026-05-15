import { useState } from "react";
import { useApp } from "../store/AppContext";
import PlayerInput from "../components/game/PlayerInput";
import PlayerList from "../components/game/PlayerList";
import SpinBottle from "../components/game/SpinBottle";

const MODES = ["random", "truth", "dare", "drink"];

export default function SpinTheBottlePage() {
  const { t, isDark, players, addPlayer, removePlayer } = useApp();
  const [spinMode, setSpinMode] = useState("random");

  const modeLabels = {
    random: { label: t("spin.modes.random") },
    truth: { label: t("spin.modes.truth") },
    dare: { label: t("spin.modes.dare") },
    drink: { label: "Drink 🥃" },
  };

  const spinModeLabel = t("spin.mode");

  return (
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
              <PlayerList players={players} onRemove={removePlayer} />
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
        </div>

        {/* Spin component */}
        <div
          className={`rounded-3xl p-8 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
        >
          <SpinBottle players={players} spinMode={spinMode} />
        </div>
      </div>
    </div>
  );
}
