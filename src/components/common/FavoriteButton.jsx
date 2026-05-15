import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';

export default function FavoriteButton({ gameId, className = '' }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(gameId);

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(gameId);
      }}
      whileTap={{ scale: 0.8 }}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
        fav
          ? 'bg-pink-500/20 text-pink-400'
          : 'bg-white/10 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10'
      } ${className}`}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className="w-5 h-5"
        fill={fav ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </motion.button>
  );
}
