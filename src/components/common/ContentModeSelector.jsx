import { useApp } from "../../store/AppContext";

const MODES = ["builtin", "custom", "mixed"];

export default function ContentModeSelector({ value, onChange }) {
  const { t, isDark } = useApp();

  return (
    <div className="flex gap-2">
      {MODES.map((mode) => {
        const active = value === mode;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
              active
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/20"
                : isDark
                  ? "bg-white/10 text-slate-300 hover:bg-white/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t(`game.contentMode.${mode}`)}
          </button>
        );
      })}
    </div>
  );
}
