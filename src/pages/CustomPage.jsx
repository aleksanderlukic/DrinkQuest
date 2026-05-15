import { useState } from "react";
import { useApp } from "../store/AppContext";
import { generateId } from "../utils/randomizer";

const TABS = [
  { key: "truths", emoji: "💬", labelKey: "custom.tabs.truths" },
  { key: "dares", emoji: "🎯", labelKey: "custom.tabs.dares" },
  { key: "nhie", emoji: "🙅", labelKey: "custom.tabs.nhie" },
  { key: "mlt", emoji: "☝️", labelKey: "custom.tabs.mlt" },
];

const TYPE_MAP = {
  truths: "truth",
  dares: "dare",
  nhie: "statement",
  mlt: "prompt",
};

export default function CustomPage() {
  const {
    t,
    isDark,
    customTruths,
    setCustomTruths,
    customDares,
    setCustomDares,
    customNhie,
    setCustomNhie,
    customMlt,
    setCustomMlt,
  } = useApp();
  const [activeTab, setActiveTab] = useState("truths");
  const [input, setInput] = useState("");

  const getList = () => {
    if (activeTab === "truths") return customTruths || [];
    if (activeTab === "dares") return customDares || [];
    if (activeTab === "nhie") return customNhie || [];
    if (activeTab === "mlt") return customMlt || [];
    return [];
  };

  const setList = (list) => {
    if (activeTab === "truths") setCustomTruths(list);
    else if (activeTab === "dares") setCustomDares(list);
    else if (activeTab === "nhie") setCustomNhie(list);
    else if (activeTab === "mlt") setCustomMlt(list);
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const entry = {
      id: generateId(),
      text: trimmed,
      type: TYPE_MAP[activeTab] || "question",
      difficulty: "normal",
      requiresNames: false,
      source: "custom",
    };
    setList([...getList(), entry]);
    setInput("");
  };

  const handleDelete = (id) => {
    setList(getList().filter((q) => q.id !== id));
  };

  const list = getList();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✏️</div>
          <h1
            className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t("custom.title")}
          </h1>
          <p
            className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {t("custom.subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg"
                  : isDark
                    ? "bg-white/10 text-slate-300 hover:bg-white/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.emoji} {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Add input */}
        <div
          className={`rounded-2xl p-5 mb-5 ${isDark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-200 shadow-sm"}`}
        >
          <h3
            className={`font-bold text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            {t("custom.form.add")}
          </h3>
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("custom.form.questionPlaceholder")}
              rows={2}
              className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all border resize-none ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-400"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="px-5 py-2 rounded-xl font-bold text-sm btn-primary disabled:opacity-40 self-end"
            >
              {t("custom.form.add")}
            </button>
          </div>
        </div>

        {/* List */}
        {list.length === 0 ? (
          <div
            className={`text-center py-12 rounded-2xl ${isDark ? "bg-slate-900 border border-white/5" : "bg-slate-50 border border-slate-200"}`}
          >
            <p className={`text-3xl mb-3`}>📝</p>
            <p
              className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              {t("custom.empty.truths")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p
              className={`text-xs font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              {t("custom.count", { count: list.length })}
            </p>
            {list.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  isDark
                    ? "bg-slate-900 border border-white/5"
                    : "bg-white border border-slate-200"
                }`}
              >
                <p
                  className={`flex-1 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {item.text}
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
