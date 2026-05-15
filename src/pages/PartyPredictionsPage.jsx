import { useState, useMemo } from "react";
import { useApp } from "../store/AppContext";
import { partyPredictions } from "../data/games/partyPredictions";
import PlayerInput from "../components/game/PlayerInput";
import PlayerList from "../components/game/PlayerList";

export default function PartyPredictionsPage() {
  const {
    t,
    isDark,
    language,
    players,
    addPlayer,
    removePlayer,
    clearPlayers,
  } = useApp();

  const [phase, setPhase] = useState("setup"); // setup | game | result
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState({}); // { questionId: playerName }
  const [scores, setScores] = useState({}); // { playerName: count }
  const [voted, setVoted] = useState(false);

  const lang = language === "sv" ? "sv" : "en";

  const questions = useMemo(() => {
    const data = partyPredictions[lang] || [];
    // Shuffle deterministically for the session
    return [...data].sort(() => Math.random() - 0.5);
  }, [lang]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;

  const handleVote = (playerName) => {
    if (voted) return;
    setVoted(true);
    setVotes((prev) => ({ ...prev, [currentQuestion.id]: playerName }));
    setScores((prev) => ({
      ...prev,
      [playerName]: (prev[playerName] || 0) + 1,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setPhase("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setVoted(false);
    }
  };

  const handleRestart = () => {
    setPhase("setup");
    setCurrentIndex(0);
    setVotes({});
    setScores({});
    setVoted(false);
  };

  // Sorted ranking
  const ranking = useMemo(() => {
    return [...players]
      .map((p) => ({ name: p, count: scores[p] || 0 }))
      .sort((a, b) => b.count - a.count);
  }, [players, scores]);

  if (phase === "setup") {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔮</div>
            <h1
              className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.partyPredictions.title")}
            </h1>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("games.partyPredictions.description")}
            </p>
          </div>
          <div
            className={`rounded-3xl p-6 space-y-6 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
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
            <button
              onClick={() => setPhase("game")}
              disabled={players.length < 2}
              className="w-full py-4 rounded-2xl font-black btn-primary text-base disabled:opacity-40"
            >
              {t("game.setup.startGame")} 🔮
            </button>
            {players.length < 2 && (
              <p
                className={`text-xs text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                {t("errors.addPlayerFirst")}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const winner = ranking[0];
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🏆</div>
            <h1
              className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.partyPredictions.results")}
            </h1>
          </div>
          {winner && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-center text-white">
              <p className="text-sm font-semibold opacity-80 mb-1">
                {t("games.partyPredictions.mostVoted")}
              </p>
              <p className="text-4xl font-black">{winner.name}</p>
              <p className="text-sm mt-2 opacity-80">
                {winner.count} {t("games.partyPredictions.votes")}
              </p>
              <p className="text-2xl mt-3">
                🍺 {t("games.partyPredictions.drinkRule")}
              </p>
            </div>
          )}
          <div
            className={`rounded-3xl p-6 space-y-3 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            <h3
              className={`font-bold text-sm mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              {t("games.partyPredictions.fullRanking")}
            </h3>
            {ranking.map((entry, i) => (
              <div
                key={entry.name}
                className={`flex items-center justify-between p-3 rounded-2xl ${
                  i === 0
                    ? isDark
                      ? "bg-amber-500/20 border border-amber-500/30"
                      : "bg-amber-50 border border-amber-200"
                    : isDark
                      ? "bg-white/5"
                      : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {i === 0
                      ? "🥇"
                      : i === 1
                        ? "🥈"
                        : i === 2
                          ? "🥉"
                          : `${i + 1}.`}
                  </span>
                  <span
                    className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {entry.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {entry.count} {t("games.partyPredictions.votes")}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleRestart}
            className="w-full py-4 rounded-2xl font-black btn-primary text-base"
          >
            {t("common.reset")} 🔮
          </button>
        </div>
      </div>
    );
  }

  // Game phase
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {currentIndex + 1} / {questions.length}
          </span>
          <button
            onClick={handleRestart}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              isDark
                ? "border-white/10 text-slate-400 hover:border-white/20"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {t("common.reset")}
          </button>
        </div>

        {/* Question card */}
        <div
          className={`rounded-3xl p-8 text-center ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
        >
          <div className="text-4xl mb-4">🔮</div>
          <p
            className={`text-xl font-bold leading-relaxed ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {currentQuestion?.text}
          </p>
        </div>

        {/* Player vote buttons */}
        <div
          className={`rounded-3xl p-6 space-y-3 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
        >
          <p
            className={`text-xs font-semibold text-center mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {t("games.partyPredictions.vote")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {players.map((player) => {
              const isVoted = votes[currentQuestion?.id] === player;
              return (
                <button
                  key={player}
                  onClick={() => handleVote(player)}
                  disabled={voted}
                  className={`py-3 px-4 rounded-2xl font-semibold text-sm transition-all ${
                    isVoted
                      ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white scale-95"
                      : voted
                        ? isDark
                          ? "bg-white/5 text-slate-500"
                          : "bg-slate-100 text-slate-400"
                        : isDark
                          ? "bg-white/10 text-slate-200 hover:bg-white/20 active:scale-95"
                          : "bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-700 active:scale-95"
                  }`}
                >
                  {player}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next button (only after voting) */}
        {voted && (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-black btn-primary text-base"
          >
            {isLastQuestion
              ? t("games.partyPredictions.seeResults")
              : t("game.play.next")}{" "}
            →
          </button>
        )}
      </div>
    </div>
  );
}
