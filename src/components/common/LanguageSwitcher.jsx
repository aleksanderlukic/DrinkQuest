import { useApp } from "../../store/AppContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, isDark } = useApp();

  const toggle = () => setLanguage(language === "en" ? "sv" : "en");

  return (
    <button
      onClick={toggle}
      title={`Switch to ${language === "en" ? "Svenska" : "English"}`}
      className={`h-9 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-90 ${
        isDark
          ? "bg-white/10 hover:bg-white/20 text-white"
          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
      }`}
      aria-label={`Switch language to ${language === "en" ? "Swedish" : "English"}`}
    >
      {language === "en" ? "🇸🇪 SV" : "🇬🇧 EN"}
    </button>
  );
}
