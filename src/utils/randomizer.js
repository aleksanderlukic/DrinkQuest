/**
 * Returns a random integer between min and max (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random item from an array
 */
export function randomItem(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffles an array (Fisher-Yates)
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Gets next question avoiding recent repeats.
 * Returns null when all questions exhausted.
 */
export function getNextQuestion(questions, recentIds, avoidFraction = 0.6) {
  if (!questions || questions.length === 0) return null;

  const avoidCount = Math.floor(questions.length * avoidFraction);
  const recentSlice = recentIds.slice(-avoidCount);
  const available = questions.filter((q) => !recentSlice.includes(q.id));

  if (available.length === 0) {
    // All avoided — just pick from the full pool (but not the very last one)
    const lastId = recentIds[recentIds.length - 1];
    const fallback = questions.filter((q) => q.id !== lastId);
    return fallback.length > 0 ? randomItem(fallback) : randomItem(questions);
  }

  return randomItem(available);
}

/**
 * Generates a unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
