import { useState, useMemo } from "react";
import { useApp } from "../store/AppContext";
import { useGameState } from "../hooks/useGameState";
import { mostLikelyTo } from "../data/games/mostLikelyTo";
import PlayerInput from "../components/game/PlayerInput";
import PlayerList from "../components/game/PlayerList";
import QuestionCard from "../components/game/QuestionCard";
import GameControls from "../components/game/GameControls";
import DifficultySelector from "../components/common/DifficultySelector";
import ContentModeSelector from "../components/common/ContentModeSelector";

export default function MostLikelyToPage() {
  const {
    t,
    isDark,
    language,
    players,
    addPlayer,
    removePlayer,
    settings,
    customMlt,
  } = useApp();
  const [phase, setPhase] = useState("setup");
  const [difficulty, setDifficulty] = useState(settings.difficulty || "all");
  const [contentMode, setContentMode] = useState(
    settings.contentMode || "builtin",
  );

  const [skipPenalty, setSkipPenalty] = useState(false);

  const lang = language === "sv" ? "sv" : "en";

  const questions = useMemo(() => {
    const data = mostLikelyTo[lang] || {};
    const flat =
      difficulty === "all"
        ? [...(data.soft || []), ...(data.normal || []), ...(data.brutal || [])]
        : data[difficulty] || [];
    if (contentMode === "builtin") return flat;
    if (contentMode === "custom") return customMlt || [];
    return [...flat, ...(customMlt || [])];
  }, [lang, difficulty, contentMode, customMlt]);

  const gameState = useGameState({
    builtinQuestions: questions,
    customQuestions: [],
    players,
    difficulty: "all",
    contentMode: "builtin",
    activeTypes: [],
  });
  const { currentQuestion, currentPlayer, next, reset, allUsed, roundCount } =
    gameState;
  const handleReset = () => {
    reset();
    setPhase("setup");
  };

  if (phase === "setup") {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">☝️</div>
            <h1
              className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.mostLikelyTo.title")}
            </h1>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("games.mostLikelyTo.description")}
            </p>
          </div>
          <div
            className={`rounded-3xl p-6 space-y-6 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            <div>
              <h3
                className={`font-bold text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {t("game.setup.players")} ({t("common.optional")})
              </h3>
              <PlayerInput onAdd={addPlayer} />
              <div className="mt-3">
                <PlayerList players={players} onRemove={removePlayer} />
              </div>
            </div>
            <div>
              <h3
                className={`font-bold text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {t("game.setup.difficulty")}
              </h3>
              <DifficultySelector value={difficulty} onChange={setDifficulty} />
            </div>
            <div>
              <h3
                className={`font-bold text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {t("game.setup.contentSource")}
              </h3>
              <ContentModeSelector
                value={contentMode}
                onChange={setContentMode}
              />
            </div>
            <div
              className={`flex items-center justify-between gap-4 p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}
            >
              <div>
                <p
                  className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {t("game.setup.skipPenalty")} 🥃
                </p>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {t("game.setup.skipPenaltyDesc")}
                </p>
              </div>
              <button
                onClick={() => setSkipPenalty((p) => !p)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${skipPenalty ? "bg-amber-500" : isDark ? "bg-white/20" : "bg-slate-300"}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${skipPenalty ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>
            <button
              onClick={() => {
                next();
                setPhase("game");
              }}
              disabled={questions.length === 0}
              className="w-full py-4 rounded-2xl font-black btn-primary text-base disabled:opacity-40"
            >
              {t("game.setup.startGame")} 🎉
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <h1
            className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t("games.mostLikelyTo.title")}
          </h1>
          <p
            className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Point at the person who fits best! 👉
          </p>
        </div>
        {allUsed ? (
          <div
            className={`text-center py-12 rounded-3xl ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200"}`}
          >
            <div className="text-4xl mb-4">🎊</div>
            <p
              className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("game.play.allUsed")}
            </p>
            <button
              onClick={handleReset}
              className="mt-4 btn-primary text-sm px-6 py-3 rounded-full"
            >
              {t("game.play.reset")}
            </button>
          </div>
        ) : (
          <>
            <QuestionCard
              question={currentQuestion}
              player={currentPlayer}
              cardKey={roundCount}
            />
            <GameControls
              onNext={next}
              onReset={handleReset}
              onSkip={next}
              skipPenaltyEnabled={skipPenalty}
            />
          </>
        )}
      </div>
    </div>
  );
}
