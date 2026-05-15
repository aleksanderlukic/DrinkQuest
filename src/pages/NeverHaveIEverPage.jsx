import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useGameState } from '../hooks/useGameState';
import { neverHaveIEver } from '../data/games/neverHaveIEver';
import PlayerInput from '../components/game/PlayerInput';
import PlayerList from '../components/game/PlayerList';
import QuestionCard from '../components/game/QuestionCard';
import GameControls from '../components/game/GameControls';
import DifficultySelector from '../components/common/DifficultySelector';
import ContentModeSelector from '../components/common/ContentModeSelector';

export default function NeverHaveIEverPage() {
  const { t, isDark, language, players, addPlayer, removePlayer, settings, customNhie } = useApp();
  const [phase, setPhase] = useState('setup');
  const [difficulty, setDifficulty] = useState(settings.difficulty || 'all');
  const [contentMode, setContentMode] = useState(settings.contentMode || 'builtin');

  const lang = language === 'sv' ? 'sv' : 'en';
  const data = neverHaveIEver[lang] || {};

  const flatBuiltin = difficulty === 'all'
    ? [...(data.soft||[]), ...(data.normal||[]), ...(data.brutal||[])]
    : data[difficulty] || [];

  let questions;
  if (contentMode === 'builtin') questions = flatBuiltin;
  else if (contentMode === 'custom') questions = customNhie || [];
  else questions = [...flatBuiltin, ...(customNhie||[])];

  const gameState = useGameState({ builtinQuestions: questions, customQuestions: [], players, difficulty: 'all', contentMode: 'builtin', activeTypes: [] });
  const { currentQuestion, currentPlayer, next, reset, allUsed } = gameState;

  const handleReset = () => { reset(); setPhase('setup'); };

  if (phase === 'setup') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🙅</div>
            <h1 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('games.neverHaveIEver.title')}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('games.neverHaveIEver.description')}</p>
          </div>
          <div className={`rounded-3xl p-6 space-y-6 ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200 shadow-lg'}`}>
            <div>
              <h3 className={`font-bold text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t('game.setup.players')} ({t('game.setup.optional')})</h3>
              <PlayerInput onAdd={addPlayer} />
              <div className="mt-3"><PlayerList players={players} onRemove={removePlayer} /></div>
            </div>
            <div>
              <h3 className={`font-bold text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t('game.setup.difficulty')}</h3>
              <DifficultySelector value={difficulty} onChange={setDifficulty} />
            </div>
            <div>
              <h3 className={`font-bold text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t('game.setup.contentMode')}</h3>
              <ContentModeSelector value={contentMode} onChange={setContentMode} />
            </div>
            <button onClick={() => setPhase('game')} disabled={questions.length === 0} className="w-full py-4 rounded-2xl font-black btn-primary text-base disabled:opacity-40">
              {t('game.setup.start')} 🎉
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('games.neverHaveIEver.title')}</h1>
        </div>
        {allUsed ? (
          <div className={`text-center py-12 rounded-3xl ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'}`}>
            <div className="text-4xl mb-4">🎊</div>
            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('game.allUsed')}</p>
            <button onClick={handleReset} className="mt-4 btn-primary text-sm px-6 py-3 rounded-full">{t('game.controls.reset')}</button>
          </div>
        ) : (
          <>
            <QuestionCard question={currentQuestion} player={currentPlayer} />
            <GameControls onNext={next} onReset={handleReset} />
          </>
        )}
      </div>
    </div>
  );
}
