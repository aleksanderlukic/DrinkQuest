import { Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

const CATEGORIES = [
  { key: 'classic', emoji: '🎯', gradient: 'from-violet-600 to-purple-700', path: '/games' },
  { key: 'drinking', emoji: '🥃', gradient: 'from-red-500 to-rose-600', path: '/games' },
  { key: 'couples', emoji: '💑', gradient: 'from-pink-500 to-fuchsia-600', path: '/games/couples' },
  { key: 'custom', emoji: '✨', gradient: 'from-amber-500 to-orange-600', path: '/custom' },
];

export default function CategoryGrid() {
  const { t, isDark } = useApp();

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('home.categories.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={cat.path}
              className={`group relative overflow-hidden rounded-2xl p-6 text-center transition-all active:scale-95 bg-gradient-to-br ${cat.gradient} shadow-lg hover:shadow-xl hover:scale-[1.02]`}
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-black text-white text-base mb-1">
                {t(`home.categories.${cat.key}.title`)}
              </h3>
              <p className="text-white/70 text-xs leading-tight">
                {t(`home.categories.${cat.key}.desc`)}
              </p>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-2xl" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
