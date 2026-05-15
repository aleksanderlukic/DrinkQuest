import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { generateQuestions } from '../data/generatorTemplates';
import { generateId } from '../utils/randomizer';

const TONES = ['funny', 'wild', 'awkward', 'flirty', 'brutal'];

export default function GeneratorPage() {
  const { t, isDark, language, setCustomTruths, customTruths } = useApp();
  const [form, setForm] = useState({ event: '', place: '', vibe: '', group: '', tone: 'funny', count: 10 });
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [saved, setSaved] = useState(false);

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleGenerate = () => {
    const q = generateQuestions({ ...form, language, count: form.count });
    setResults(q);
    setSelected(new Set());
    setSaved(false);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSave = (all = false) => {
    const toSave = all ? results : results.filter((q) => selected.has(q.id));
    const tagged = toSave.map((q) => ({ ...q, id: generateId() }));
    setCustomTruths([...(customTruths || []), ...tagged]);
    setSaved(true);
  };

  const toneLabels = {
    funny: { label: t('generator.tones.funny'), emoji: '😂' },
    wild: { label: t('generator.tones.wild'), emoji: '🔥' },
    awkward: { label: t('generator.tones.awkward'), emoji: '😬' },
    flirty: { label: t('generator.tones.flirty'), emoji: '😏' },
    brutal: { label: t('generator.tones.brutal'), emoji: '💀' },
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤖</div>
          <h1 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('generator.title')}</h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('generator.subtitle')}</p>
        </div>

        {/* Form */}
        <div className={`rounded-3xl p-6 space-y-5 mb-6 ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200 shadow-lg'}`}>
          <div className="grid grid-cols-2 gap-4">
            {['event', 'place', 'vibe', 'group'].map((field) => (
              <div key={field}>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t(`generator.fields.${field}`)}
                </label>
                <input
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={t(`generator.placeholders.${field}`)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-violet-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-400'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Tone */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('generator.tone')}</label>
            <div className="flex gap-2 flex-wrap">
              {TONES.map((tone) => {
                const cfg = toneLabels[tone];
                return (
                  <button
                    key={tone}
                    onClick={() => handleChange('tone', tone)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                      form.tone === tone
                        ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg'
                        : isDark
                        ? 'bg-white/10 text-slate-300 hover:bg-white/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count */}
          <div className="flex items-center gap-4">
            <label className={`text-xs font-semibold whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('generator.count')}: {form.count}
            </label>
            <input
              type="range" min="5" max="20" step="1"
              value={form.count}
              onChange={(e) => handleChange('count', parseInt(e.target.value))}
              className="flex-1 accent-violet-500"
            />
          </div>

          <button onClick={handleGenerate} className="w-full py-4 rounded-2xl font-black btn-primary text-base">
            {t('generator.generate')} ✨
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {results.length} {t('generator.results')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(false)}
                  disabled={selected.size === 0 || saved}
                  className="px-4 py-2 rounded-full text-xs font-bold btn-primary disabled:opacity-40"
                >
                  {t('generator.saveSelected')} ({selected.size})
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saved}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors"
                >
                  {saved ? t('generator.saved') : t('generator.saveAll')}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {results.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleSelect(q.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    selected.has(q.id)
                      ? isDark
                        ? 'bg-violet-600/20 border border-violet-500/40'
                        : 'bg-violet-50 border border-violet-300'
                      : isDark
                      ? 'bg-slate-900 border border-white/5 hover:border-white/10'
                      : 'bg-white border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${
                    selected.has(q.id)
                      ? 'bg-violet-600 border-violet-600'
                      : isDark ? 'border-slate-600' : 'border-slate-300'
                  }`}>
                    {selected.has(q.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className={`flex-1 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{q.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
