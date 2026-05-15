/**
 * Replaces template placeholders with actual values.
 * Supports {name}, {name1}, {name2}, {place}, {event}, {group}, {vibe}
 */
export function fillTemplate(template, data = {}) {
  if (!template) return "";
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }
  });
  return result;
}

/**
 * Picks N random items from an array (no repeats within the pick)
 */
export function pickRandom(arr, count = 1) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Resolves name placeholders in a question using provided players.
 * Picks random unique players for {name}, {name1}, {name2}.
 */
export function resolvePlayers(template, players = []) {
  if (!players.length) {
    return template
      .replace(/\{name\}/g, "you")
      .replace(/\{name1\}/g, "Player 1")
      .replace(/\{name2\}/g, "Player 2");
  }

  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const name = shuffled[0];
  const name1 = shuffled[0];
  const name2 = shuffled.length > 1 ? shuffled[1] : shuffled[0];

  return template
    .replace(/\{name\}/g, name)
    .replace(/\{name1\}/g, name1)
    .replace(/\{name2\}/g, name2);
}

/**
 * Fully resolve a template with all possible data sources.
 */
export function resolveTemplate(
  template,
  { players = [], place = "", event = "", group = "", vibe = "" } = {},
) {
  let result = resolvePlayers(template, players);
  result = fillTemplate(result, { place, event, group, vibe });
  return result;
}
