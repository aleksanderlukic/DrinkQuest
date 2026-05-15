import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '../utils/localStorage';
import { en } from '../i18n/en';
import { sv } from '../i18n/sv';

const AppContext = createContext(null);

const translations = { en, sv };

const DEFAULT_SETTINGS = {
  difficulty: 'normal',
  contentMode: 'mixed',
  nameMode: 'with',
};

export function AppProvider({ children }) {
  // Theme
  const [theme, setThemeState] = useState(() => storage.get(STORAGE_KEYS.THEME, 'dark'));

  // Language
  const [language, setLanguageState] = useState(() => storage.get(STORAGE_KEYS.LANGUAGE, 'en'));

  // Players
  const [players, setPlayersState] = useState(() => storage.get(STORAGE_KEYS.PLAYERS, []));

  // Favorites (array of game IDs)
  const [favorites, setFavoritesState] = useState(() => storage.get(STORAGE_KEYS.FAVORITES, []));

  // Settings
  const [settings, setSettingsState] = useState(() =>
    storage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  // Onboarding
  const [onboardingSeen, setOnboardingSeen] = useState(() =>
    storage.get(STORAGE_KEYS.ONBOARDING_SEEN, false)
  );

  // Custom content
  const [customTruths, setCustomTruths] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_TRUTHS, []));
  const [customDares, setCustomDares] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_DARES, []));
  const [customNhie, setCustomNhie] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_NHIE, []));
  const [customMlt, setCustomMlt] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_MLT, []));
  const [customPacks, setCustomPacks] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_PACKS, []));
  const [customPointing, setCustomPointing] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_POINTING, []));
  const [customTod, setCustomTod] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_TOD, []));
  const [customCouples, setCustomCouples] = useState(() => storage.get(STORAGE_KEYS.CUSTOM_COUPLES, []));

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.set(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Translation function
  const t = useCallback(
    (path, vars = {}) => {
      const trans = translations[language] || translations.en;
      const keys = path.split('.');
      let value = trans;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          // Fallback to English
          let fallback = translations.en;
          for (const k of keys) {
            if (fallback && typeof fallback === 'object' && k in fallback) {
              fallback = fallback[k];
            } else {
              return path;
            }
          }
          value = fallback;
          break;
        }
      }
      if (typeof value !== 'string') return path;
      // Replace template variables like {{count}}
      let result = value;
      Object.entries(vars).forEach(([k, v]) => {
        result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      });
      return result;
    },
    [language]
  );

  // Theme actions
  const setTheme = useCallback((val) => {
    setThemeState(val);
    storage.set(STORAGE_KEYS.THEME, val);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Language actions
  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    storage.set(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  // Player actions
  const addPlayer = useCallback(
    (name) => {
      const trimmed = name.trim();
      if (!trimmed || players.includes(trimmed)) return;
      const updated = [...players, trimmed];
      setPlayersState(updated);
      storage.set(STORAGE_KEYS.PLAYERS, updated);
    },
    [players]
  );

  const removePlayer = useCallback(
    (name) => {
      const updated = players.filter((p) => p !== name);
      setPlayersState(updated);
      storage.set(STORAGE_KEYS.PLAYERS, updated);
    },
    [players]
  );

  const clearPlayers = useCallback(() => {
    setPlayersState([]);
    storage.set(STORAGE_KEYS.PLAYERS, []);
  }, []);

  // Favorites actions
  const toggleFavorite = useCallback(
    (gameId) => {
      const updated = favorites.includes(gameId)
        ? favorites.filter((id) => id !== gameId)
        : [...favorites, gameId];
      setFavoritesState(updated);
      storage.set(STORAGE_KEYS.FAVORITES, updated);
    },
    [favorites]
  );

  const isFavorite = useCallback((gameId) => favorites.includes(gameId), [favorites]);

  const clearFavorites = useCallback(() => {
    setFavoritesState([]);
    storage.set(STORAGE_KEYS.FAVORITES, []);
  }, []);

  // Settings actions
  const updateSettings = useCallback(
    (updates) => {
      const updated = { ...settings, ...updates };
      setSettingsState(updated);
      storage.set(STORAGE_KEYS.SETTINGS, updated);
    },
    [settings]
  );

  // Onboarding
  const completeOnboarding = useCallback(() => {
    setOnboardingSeen(true);
    storage.set(STORAGE_KEYS.ONBOARDING_SEEN, true);
  }, []);

  // Custom content helpers
  const makeCustomSetter = (setter, key) => (updater) => {
    setter((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set(key, next);
      return next;
    });
  };

  const setCustomTruthsSafe = makeCustomSetter(setCustomTruths, STORAGE_KEYS.CUSTOM_TRUTHS);
  const setCustomDaresSafe = makeCustomSetter(setCustomDares, STORAGE_KEYS.CUSTOM_DARES);
  const setCustomNhieSafe = makeCustomSetter(setCustomNhie, STORAGE_KEYS.CUSTOM_NHIE);
  const setCustomMltSafe = makeCustomSetter(setCustomMlt, STORAGE_KEYS.CUSTOM_MLT);
  const setCustomPacksSafe = makeCustomSetter(setCustomPacks, STORAGE_KEYS.CUSTOM_PACKS);
  const setCustomPointingSafe = makeCustomSetter(setCustomPointing, STORAGE_KEYS.CUSTOM_POINTING);
  const setCustomTodSafe = makeCustomSetter(setCustomTod, STORAGE_KEYS.CUSTOM_TOD);
  const setCustomCouplesSafe = makeCustomSetter(setCustomCouples, STORAGE_KEYS.CUSTOM_COUPLES);

  const clearCustomContent = useCallback(() => {
    setCustomTruths([]);
    setCustomDares([]);
    setCustomNhie([]);
    setCustomMlt([]);
    setCustomPacks([]);
    setCustomPointing([]);
    setCustomTod([]);
    setCustomCouples([]);
    [
      STORAGE_KEYS.CUSTOM_TRUTHS,
      STORAGE_KEYS.CUSTOM_DARES,
      STORAGE_KEYS.CUSTOM_NHIE,
      STORAGE_KEYS.CUSTOM_MLT,
      STORAGE_KEYS.CUSTOM_PACKS,
      STORAGE_KEYS.CUSTOM_POINTING,
      STORAGE_KEYS.CUSTOM_TOD,
      STORAGE_KEYS.CUSTOM_COUPLES,
    ].forEach((k) => storage.remove(k));
  }, []);

  // Reset all data
  const resetAll = useCallback(() => {
    clearPlayers();
    clearFavorites();
    clearCustomContent();
    updateSettings(DEFAULT_SETTINGS);
    setOnboardingSeen(false);
    storage.set(STORAGE_KEYS.ONBOARDING_SEEN, false);
  }, [clearPlayers, clearFavorites, clearCustomContent, updateSettings]);

  const value = {
    // Theme
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',

    // Language
    language,
    setLanguage,
    t,

    // Players
    players,
    addPlayer,
    removePlayer,
    clearPlayers,

    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,

    // Settings
    settings,
    updateSettings,

    // Onboarding
    onboardingSeen,
    completeOnboarding,

    // Custom content
    customTruths,
    setCustomTruths: setCustomTruthsSafe,
    customDares,
    setCustomDares: setCustomDaresSafe,
    customNhie,
    setCustomNhie: setCustomNhieSafe,
    customMlt,
    setCustomMlt: setCustomMltSafe,
    customPacks,
    setCustomPacks: setCustomPacksSafe,
    customPointing,
    setCustomPointing: setCustomPointingSafe,
    customTod,
    setCustomTod: setCustomTodSafe,
    customCouples,
    setCustomCouples: setCustomCouplesSafe,
    clearCustomContent,

    // Reset
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
