import { useApp } from "../../store/AppContext";

const DIFFICULTIES = ["all", "soft", "normal", "brutal"];

const COLORS = {
  all: "from-slate-500 to-slate-600",
  soft: "from-emerald-500 to-teal-600",
  normal: "from-amber-500 to-orange-600",
  brutal: "from-red-500 to-rose-600",
};

export default function DifficultySelector({ value, onChange }) {
  const { t, isDark } = useApp();

  return (
    <div className="flex flex-wrap gap-2">
      {DIFFICULTIES.map((d) => {
        const active = value === d;
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
              active
                ? `bg-gradient-to-r ${COLORS[d]} text-white shadow-lg`
                : isDark
                  ? "bg-white/10 text-slate-300 hover:bg-white/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t(`game.difficulty.${d === "all" ? "all" : d + "Label"}`)}
          </button>
        );
      })}
    </div>
  );
}
