import { useState } from 'react';
import { useApp } from '../store/AppContext';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import DifficultySelector from '../components/common/DifficultySelector';
import ContentModeSelector from '../components/common/ContentModeSelector';

export default function SettingsPage() {
  const { t, isDark, settings, updateSettings, clearCustomContent, clearFavorites, clearPlayers, resetAll } = useApp();
  const [resetConfirm, setResetConfirm] = useState(null);

  const Section = ({ title, children }) => (
    <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
      <h3 className={`font-bold text-base mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <div>{children}</div>
    </div>
  );

  const confirmAction = (key, action) => {
    if (resetConfirm === key) {
      action();
      setResetConfirm(null);
    } else {
      setResetConfirm(key);
    }
  };

  const DangerButton = ({ actionKey, label, confirmLabel, action }) => (
    <button
      onClick={() => confirmAction(actionKey, action)}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
        resetConfirm === actionKey
          ? 'bg-red-600 text-white'
          : isDark
          ? 'bg-white/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
          : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
      }`}
    >
      {resetConfirm === actionKey ? confirmLabel : label}
    </button>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">⚙️</div>
          <h1 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('settings.title')}</h1>
        </div>

        <div className="space-y-4">
          {/* Appearance */}
          <Section title={t('settings.appearance')}>
            <Row label={t('settings.theme')}>
              <ThemeToggle />
            </Row>
          </Section>

          {/* Language */}
          <Section title={t('settings.language')}>
            <Row label={t('settings.languageLabel')}>
              <LanguageSwitcher />
            </Row>
          </Section>

          {/* Gameplay defaults */}
          <Section title={t('settings.gameplay')}>
            <div>
              <label className={`text-xs font-semibold block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.defaultDifficulty')}</label>
              <DifficultySelector value={settings.difficulty || 'all'} onChange={(v) => updateSettings({ difficulty: v })} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.defaultContentMode')}</label>
              <ContentModeSelector value={settings.contentMode || 'builtin'} onChange={(v) => updateSettings({ contentMode: v })} />
            </div>
          </Section>

          {/* Data */}
          <Section title={t('settings.data')}>
            <Row label={t('settings.clearFavorites')}>
              <DangerButton
                actionKey="fav"
                label={t('settings.clear')}
                confirmLabel={t('settings.confirm')}
                action={clearFavorites}
              />
            </Row>
            <Row label={t('settings.clearPlayers')}>
              <DangerButton
                actionKey="players"
                label={t('settings.clear')}
                confirmLabel={t('settings.confirm')}
                action={clearPlayers}
              />
            </Row>
            <Row label={t('settings.clearCustom')}>
              <DangerButton
                actionKey="custom"
                label={t('settings.clear')}
                confirmLabel={t('settings.confirm')}
                action={clearCustomContent}
              />
            </Row>
            <div className={`pt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Row label={t('settings.resetAll')}>
                <DangerButton
                  actionKey="all"
                  label={t('settings.resetAllBtn')}
                  confirmLabel={t('settings.confirm')}
                  action={resetAll}
                />
              </Row>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
