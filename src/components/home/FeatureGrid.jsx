import { useApp } from '../../store/AppContext';

const FEATURES = [
  { key: 'noSignup', emoji: '🚀' },
  { key: 'bilingual', emoji: '🌍' },
  { key: 'customContent', emoji: '✏️' },
  { key: 'aiGenerator', emoji: '🤖' },
  { key: 'darkMode', emoji: '🌙' },
  { key: 'offline', emoji: '📵' },
];

export default function FeatureGrid() {
  const { t, isDark } = useApp();

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('home.features.title')}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.key}
              className={`p-6 rounded-2xl transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/5 hover:border-violet-500/20'
                  : 'bg-white border border-slate-200 hover:border-violet-300 shadow-sm'
              }`}
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t(`home.features.${f.key}.title`)}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t(`home.features.${f.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
