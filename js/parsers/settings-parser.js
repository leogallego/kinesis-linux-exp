/**
 * Settings file parser and generator for kbd_settings.txt.
 * Preserves original field order, casing, and unrecognized fields.
 */

/**
 * Parse kbd_settings.txt content.
 * @param {string} text
 * @returns {KeyboardSettings}
 */
export function parseSettings(text) {
  const settings = {
    fields: {},
    rawEntries: [],
  };

  if (!text || !text.trim()) return settings;

  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx);
      const value = trimmed.substring(eqIdx + 1);
      settings.fields[key] = value;
      settings.rawEntries.push({ index: i, key, originalLine: line });
    } else {
      settings.rawEntries.push({ index: i, key: null, originalLine: line });
    }
  }

  return settings;
}

/**
 * Generate kbd_settings.txt content.
 * @param {KeyboardSettings} settings
 * @returns {string}
 */
export function generateSettings(settings) {
  if (!settings || !settings.rawEntries) return '';

  const lines = [];

  for (const entry of settings.rawEntries) {
    if (entry.key && entry.key in settings.fields) {
      lines.push(`${entry.key}=${settings.fields[entry.key]}`);
    } else {
      lines.push(entry.originalLine);
    }
  }

  if (lines.length === 0) return '';
  return lines.join('\r\n') + '\r\n';
}
