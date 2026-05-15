import { useApp } from '../store/AppContext';
import { gamesList } from '../data/gamesList';
import GameCard from '../components/common/GameCard';
import EmptyState from '../components/common/EmptyState';

export default function FavoritesPage() {
  const { t, isDark, favorites } = useApp();

  const favoriteGames = gamesList.filter((g) => favorites.includes(g.id));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('favorites.title')}
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('favorites.subtitle')}
          </p>
        </div>

        {favoriteGames.length === 0 ? (
          <EmptyState
            icon="❤️"
            title={t('favorites.empty.title')}
            desc={t('favorites.empty.desc')}
            ctaLabel={t('favorites.empty.cta')}
            ctaTo="/games"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
