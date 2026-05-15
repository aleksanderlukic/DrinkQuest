import { useState } from "react";
import { useApp } from "../store/AppContext";
import { useGameState } from "../hooks/useGameState";
import { couples } from "../data/games/couples";
import { resolvePlayers } from "../utils/templateEngine";
import PlayerInput from "../components/game/PlayerInput";
import PlayerList from "../components/game/PlayerList";
import QuestionCard from "../components/game/QuestionCard";
import GameControls from "../components/game/GameControls";
import DifficultySelector from "../components/common/DifficultySelector";
import ContentModeSelector from "../components/common/ContentModeSelector";

export default function CouplesPage() {
  const {
    t,
    isDark,
    language,
    players,
    addPlayer,
    removePlayer,
    settings,
    customCouples,
  } = useApp();
  const [phase, setPhase] = useState("setup");
  const [difficulty, setDifficulty] = useState(settings.difficulty || "all");
  const [contentMode, setContentMode] = useState(
    settings.contentMode || "builtin",
  );

  const lang = language === "sv" ? "sv" : "en";
  const data = couples[lang] || {};

  const flatBuiltin =
    difficulty === "all"
      ? [...(data.soft || []), ...(data.normal || []), ...(data.brutal || [])]
      : data[difficulty] || [];

  let questions;
  if (contentMode === "builtin") questions = flatBuiltin;
  else if (contentMode === "custom") questions = customCouples || [];
  else questions = [...flatBuiltin, ...(customCouples || [])];

  const gameState = useGameState({
    builtinQuestions: questions,
    customQuestions: [],
    players,
    difficulty: "all",
    contentMode: "builtin",
    activeTypes: [],
  });
  const { currentQuestion, next, reset, allUsed } = gameState;

  // Resolve player names in question text
  const resolvedQuestion = currentQuestion
    ? {
        ...currentQuestion,
        text: resolvePlayers(currentQuestion.text, players),
      }
    : null;

  const handleReset = () => {
    reset();
    setPhase("setup");
  };

  if (phase === "setup") {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">💑</div>
            <h1
              className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.couples.title")}
            </h1>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("games.couples.description")}
            </p>
          </div>
          <div
            className={`rounded-3xl p-6 space-y-6 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            <div>
              <h3
                className={`font-bold text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {t("game.setup.players")}{" "}
                <span
                  className={`font-normal text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  (Best with 2 players)
                </span>
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
            <button
              onClick={() => {
                next();
                setPhase("game");
              }}
              disabled={questions.length === 0}
              className="w-full py-4 rounded-2xl font-black btn-primary text-base disabled:opacity-40"
            >
              {t("game.setup.startGame")} 💕
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
            {t("games.couples.title")}
          </h1>
        </div>
        {allUsed ? (
          <div
            className={`text-center py-12 rounded-3xl ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200"}`}
          >
            <div className="text-4xl mb-4">💕</div>
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
            <QuestionCard question={resolvedQuestion} />
            <GameControls onNext={next} onReset={handleReset} />
          </>
        )}
      </div>
    </div>
  );
}
