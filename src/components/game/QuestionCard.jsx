import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../store/AppContext";

const TYPE_CONFIG = {
  truth: {
    label: "Truth",
    emoji: "💬",
    gradient: "from-violet-600 to-purple-700",
  },
  dare: { label: "Dare", emoji: "🎯", gradient: "from-pink-600 to-rose-700" },
  statement: {
    label: "Never Have I Ever",
    emoji: "🙅",
    gradient: "from-pink-500 to-rose-600",
  },
  prompt: {
    label: "Vote",
    emoji: "☝️",
    gradient: "from-amber-500 to-orange-600",
  },
  question: {
    label: "Question",
    emoji: "❓",
    gradient: "from-blue-500 to-cyan-600",
  },
  action: {
    label: "Action",
    emoji: "⚡",
    gradient: "from-emerald-500 to-teal-600",
  },
};

export default function QuestionCard({ question, player, cardKey }) {
  const { isDark } = useApp();
  if (!question) return null;

  const cfg = TYPE_CONFIG[question.type] || TYPE_CONFIG.question;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cardKey ?? question.id}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`w-full rounded-3xl overflow-hidden shadow-2xl ${
          isDark
            ? "bg-slate-900 border border-white/10"
            : "bg-white border border-slate-200"
        }`}
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${cfg.gradient} p-6 text-center`}>
          <span className="text-4xl">{cfg.emoji}</span>
          <div className="mt-2 text-white/80 text-xs font-bold uppercase tracking-widest">
            {cfg.label}
          </div>
          {player && (
            <div className="mt-3 text-white font-black text-lg">{player}</div>
          )}
        </div>

        {/* Question text */}
        <div className="p-8 text-center">
          <p
            className={`text-xl font-bold leading-relaxed ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {question.text}
          </p>

          {/* Difficulty badge */}
          {question.difficulty && (
            <div
              className={`mt-6 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                question.difficulty === "soft"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : question.difficulty === "normal"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-red-500/10 text-red-500"
              }`}
            >
              {question.difficulty === "soft"
                ? "🌱"
                : question.difficulty === "normal"
                  ? "🔥"
                  : "💀"}{" "}
              {question.difficulty}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
