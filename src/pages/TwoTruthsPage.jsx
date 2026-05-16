import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../store/AppContext";
import PlayerInput from "../components/game/PlayerInput";
import PlayerList from "../components/game/PlayerList";

const PHASES = {
  SETUP: "setup",
  PRESENT: "present", // active player presents 3 statements
  VOTE: "vote", // others vote which is the lie
  REVEAL: "reveal", // host reveals the lie
  RESULT: "result", // show who drinks
};

export default function TwoTruthsPage() {
  const { t, isDark, players, addPlayer, removePlayer, clearPlayers } =
    useApp();

  const [phase, setPhase] = useState(PHASES.SETUP);
  const [playerOrder, setPlayerOrder] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // votes: { playerName: statementIndex (0|1|2) }
  const [votes, setVotes] = useState({});
  // which statement (0,1,2) is the lie — chosen by the active player
  const [lieIndex, setLieIndex] = useState(null);
  const [votingPlayer, setVotingPlayer] = useState(null); // index into non-active players for vote phase

  const activePlayer = playerOrder[currentIndex] ?? null;
  const otherPlayers = playerOrder.filter((p) => p !== activePlayer);

  const startGame = useCallback(() => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setPlayerOrder(shuffled);
    setCurrentIndex(0);
    setVotes({});
    setLieIndex(null);
    setVotingPlayer(0);
    setPhase(PHASES.PRESENT);
  }, [players]);

  const startVoting = () => {
    setVotingPlayer(0);
    setVotes({});
    setPhase(PHASES.VOTE);
  };

  const castVote = (statementIdx) => {
    const voter = otherPlayers[votingPlayer];
    const newVotes = { ...votes, [voter]: statementIdx };
    setVotes(newVotes);

    if (votingPlayer + 1 < otherPlayers.length) {
      setVotingPlayer((v) => v + 1);
    } else {
      // All voted
      setPhase(PHASES.REVEAL);
    }
  };

  const reveal = (idx) => {
    setLieIndex(idx);
    setPhase(PHASES.RESULT);
  };

  const nextPlayer = () => {
    const next = (currentIndex + 1) % playerOrder.length;
    setCurrentIndex(next);
    setVotes({});
    setLieIndex(null);
    setVotingPlayer(0);
    setPhase(PHASES.PRESENT);
  };

  // Count votes per statement
  const voteCounts = [0, 1, 2].map(
    (i) => Object.values(votes).filter((v) => v === i).length,
  );

  // Who guessed correctly?
  const correctGuessers =
    lieIndex !== null ? otherPlayers.filter((p) => votes[p] === lieIndex) : [];
  const wrongGuessers =
    lieIndex !== null ? otherPlayers.filter((p) => votes[p] !== lieIndex) : [];

  const statementLabels = [
    t("games.twoTruths.statement1"),
    t("games.twoTruths.statement2"),
    t("games.twoTruths.statement3"),
  ];

  // ---------- SETUP ----------
  if (phase === PHASES.SETUP) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🤥</div>
            <h1
              className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.twoTruths.title")}
            </h1>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("games.twoTruths.description")}
            </p>
          </div>

          <div
            className={`rounded-3xl p-6 space-y-6 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            {/* How to play */}
            <div
              className={`rounded-2xl p-4 text-sm space-y-1.5 ${isDark ? "bg-white/5" : "bg-violet-50"}`}
            >
              <p
                className={`font-bold ${isDark ? "text-violet-300" : "text-violet-700"}`}
              >
                {t("games.twoTruths.howToPlay")}
              </p>
              {[1, 2, 3, 4].map((n) => (
                <p
                  key={n}
                  className={`${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {t(`games.twoTruths.rule${n}`)}
                </p>
              ))}
            </div>

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

            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full py-4 rounded-2xl font-black btn-primary text-base disabled:opacity-40"
            >
              {t("game.setup.startGame")} 🎉
            </button>
            {players.length < 2 && (
              <p
                className={`text-center text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                {t("errors.addPlayerFirst")}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- PRESENT ----------
  if (phase === PHASES.PRESENT) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🤥</div>
            <h1
              className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.twoTruths.title")}
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-8 text-center ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            <div className="text-6xl mb-4">🎤</div>
            <p
              className={`text-sm font-semibold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("games.twoTruths.itsYourTurn")}
            </p>
            <p
              className={`text-3xl font-black mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {activePlayer}
            </p>
            <p
              className={`text-base leading-relaxed mb-8 ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              {t("games.twoTruths.presentInstruction")}
            </p>

            {/* Statement slots visual */}
            <div className="space-y-2 mb-8">
              {statementLabels.map((label, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    isDark
                      ? "bg-white/5 border border-white/10"
                      : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      isDark
                        ? "bg-violet-600/30 text-violet-300"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`italic ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={startVoting}
              className="w-full py-4 rounded-2xl font-black btn-primary text-base"
            >
              {t("games.twoTruths.everyoneReady")} →
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ---------- VOTE ----------
  if (phase === PHASES.VOTE) {
    const currentVoter = otherPlayers[votingPlayer];
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <h1
              className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.twoTruths.votePhase")}
            </h1>
            <p
              className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {votingPlayer + 1} / {otherPlayers.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentVoter}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={`rounded-3xl p-8 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
            >
              <div className="text-center mb-6">
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {t("games.twoTruths.nowVoting")}
                </p>
                <p
                  className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {currentVoter}
                </p>
              </div>

              <p
                className={`text-sm text-center mb-5 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                {t("games.twoTruths.voteInstruction", {
                  name: activePlayer,
                })}
              </p>

              <div className="space-y-3">
                {statementLabels.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => castVote(i)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-95 font-semibold ${
                      isDark
                        ? "bg-white/10 text-white hover:bg-violet-600/30 border border-white/10 hover:border-violet-500/50"
                        : "bg-slate-50 text-slate-900 hover:bg-violet-50 border border-slate-200 hover:border-violet-300"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                        isDark
                          ? "bg-violet-600/30 text-violet-300"
                          : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ---------- REVEAL ----------
  if (phase === PHASES.REVEAL) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <h1
              className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.twoTruths.revealPhase")}
            </h1>
          </div>

          <div
            className={`rounded-3xl p-8 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔍</div>
              <p
                className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("games.twoTruths.revealInstruction", {
                  name: activePlayer,
                })}
              </p>
            </div>

            {/* Vote tally */}
            <div className="space-y-2 mb-6">
              {statementLabels.map((label, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    isDark
                      ? "bg-white/5 border border-white/10"
                      : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      isDark
                        ? "bg-violet-600/30 text-violet-300"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`flex-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {label}
                  </span>
                  <span
                    className={`font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}
                  >
                    {voteCounts[i]} 🗳
                  </span>
                </div>
              ))}
            </div>

            <p
              className={`text-center text-sm mb-4 font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              {t("games.twoTruths.whichIsLie")}
            </p>

            <div className="space-y-3">
              {statementLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => reveal(i)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-95 font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-lg`}
                >
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-black flex-shrink-0">
                    {i + 1}
                  </span>
                  🤥 {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (phase === PHASES.RESULT) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <h1
              className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("games.twoTruths.results")}
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl p-8 space-y-6 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}
          >
            {/* The lie */}
            <div
              className={`rounded-2xl p-4 text-center ${isDark ? "bg-red-500/20 border border-red-500/30" : "bg-red-50 border border-red-200"}`}
            >
              <p
                className={`text-sm font-semibold mb-1 ${isDark ? "text-red-300" : "text-red-600"}`}
              >
                🤥 {t("games.twoTruths.theLieWas")}
              </p>
              <p
                className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("games.twoTruths.statementN", { n: lieIndex + 1 })}
              </p>
            </div>

            {/* Who guessed right */}
            {correctGuessers.length > 0 && (
              <div>
                <p
                  className={`text-sm font-bold mb-2 ${isDark ? "text-green-400" : "text-green-700"}`}
                >
                  ✅ {t("games.twoTruths.guessedRight")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {correctGuessers.map((p) => (
                    <span
                      key={p}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isDark
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Who drinks */}
            {wrongGuessers.length > 0 && (
              <div
                className={`rounded-2xl p-4 ${isDark ? "bg-amber-500/20 border border-amber-500/30" : "bg-amber-50 border border-amber-200"}`}
              >
                <p
                  className={`text-sm font-bold mb-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}
                >
                  🍺 {t("games.twoTruths.wrongGuess")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {wrongGuessers.map((p) => (
                    <span
                      key={p}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isDark
                          ? "bg-amber-500/30 text-amber-200"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* If everyone guessed correctly, the presenter drinks */}
            {wrongGuessers.length === 0 && otherPlayers.length > 0 && (
              <div
                className={`rounded-2xl p-4 text-center ${isDark ? "bg-amber-500/20 border border-amber-500/30" : "bg-amber-50 border border-amber-200"}`}
              >
                <p
                  className={`font-bold ${isDark ? "text-amber-300" : "text-amber-700"}`}
                >
                  🎉 {t("games.twoTruths.allCorrect", { name: activePlayer })}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={nextPlayer}
                className="flex-[3] py-4 rounded-2xl font-black btn-primary text-base"
              >
                {t("games.twoTruths.nextPlayer")} →
              </button>
              <button
                onClick={() => {
                  setPhase(PHASES.SETUP);
                  setPlayerOrder([]);
                  setCurrentIndex(0);
                }}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all ${
                  isDark
                    ? "bg-white/10 text-slate-400 hover:bg-white/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {t("game.play.reset")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
