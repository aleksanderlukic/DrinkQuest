import { useState } from 'react';
import { useApp } from '../../store/AppContext';

export default function PlayerInput({ onAdd }) {
  const { t, isDark } = useApp();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('game.setup.playerPlaceholder')}
        maxLength={32}
        className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border ${
          isDark
            ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:bg-white/10'
            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-400 focus:bg-white'
        }`}
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="px-5 py-3 rounded-xl text-sm font-bold btn-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {t('game.setup.addPlayer')}
      </button>
    </form>
  );
}
