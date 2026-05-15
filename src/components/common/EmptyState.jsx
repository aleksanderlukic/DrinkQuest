import { Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

export default function EmptyState({ icon = '🎲', title, desc, ctaLabel, ctaTo }) {
  const { isDark } = useApp();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="text-6xl mb-6 animate-float">{icon}</div>
      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>
      {desc && (
        <p className={`text-sm max-w-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {desc}
        </p>
      )}
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="btn-primary text-sm"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
