import { Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

export default function HeroSection() {
  const { t, isDark } = useApp();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-950 to-pink-950" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating emojis */}
      <div className="absolute top-1/4 left-8 text-4xl animate-float opacity-20 select-none pointer-events-none">🎉</div>
      <div className="absolute top-1/3 right-10 text-3xl animate-float opacity-20 select-none pointer-events-none" style={{ animationDelay: '0.8s' }}>🥂</div>
      <div className="absolute bottom-1/3 left-16 text-2xl animate-float opacity-20 select-none pointer-events-none" style={{ animationDelay: '1.4s' }}>🎲</div>
      <div className="absolute bottom-1/4 right-12 text-3xl animate-float opacity-20 select-none pointer-events-none" style={{ animationDelay: '0.4s' }}>🃏</div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-8">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
          {t('home.hero.badge')}
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6">
          {t('home.hero.headline')}
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
            {t('home.hero.headlineAccent')}
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          {t('home.hero.subheadline')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/games"
            className="px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all active:scale-95"
          >
            {t('home.hero.cta1')} 🎮
          </Link>
          <Link
            to="/games"
            className="px-8 py-4 rounded-2xl font-bold text-base bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
          >
            {t('home.hero.cta2')}
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-16">
          {[
            { value: '7', label: t('home.hero.stat1') },
            { value: '500+', label: t('home.hero.stat2') },
            { value: '2', label: t('home.hero.stat3') },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
