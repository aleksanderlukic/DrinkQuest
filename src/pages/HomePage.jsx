import { useApp } from '../store/AppContext';
import { gamesList } from '../data/gamesList';
import HeroSection from '../components/home/HeroSection';
import FeatureGrid from '../components/home/FeatureGrid';
import CategoryGrid from '../components/home/CategoryGrid';
import CTASection from '../components/home/CTASection';
import GameCard from '../components/common/GameCard';

export default function HomePage() {
  const { t, isDark } = useApp();
  const popular = gamesList.filter((g) => g.popular).slice(0, 4);

  return (
    <div>
      <HeroSection />

      {/* Popular games */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home.popular.title')}
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('home.popular.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CategoryGrid />
      <FeatureGrid />
      <CTASection />
    </div>
  );
}
