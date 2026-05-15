// Safe localStorage helpers

export const storage = {
  get(key, fallback = null) {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    try {
      window.localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  THEME: 'dq_theme',
  LANGUAGE: 'dq_language',
  PLAYERS: 'dq_players',
  FAVORITES: 'dq_favorites',
  ONBOARDING_SEEN: 'dq_onboarding_seen',
  SETTINGS: 'dq_settings',
  CUSTOM_TRUTHS: 'dq_custom_truths',
  CUSTOM_DARES: 'dq_custom_dares',
  CUSTOM_NHIE: 'dq_custom_nhie',
  CUSTOM_MLT: 'dq_custom_mlt',
  CUSTOM_PACKS: 'dq_custom_packs',
  CUSTOM_POINTING: 'dq_custom_pointing',
  CUSTOM_TOD: 'dq_custom_tod',
  CUSTOM_COUPLES: 'dq_custom_couples',
};
