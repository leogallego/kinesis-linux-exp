/**
 * LED file parser and generator for Freestyle Edge RGB.
 * Handles effect lines, per-key colors, base colors, and FN layer.
 * Per contracts/file-formats.md.
 */

import { getEffectByToken, getEffectById } from '../data/effects.js';
import { KEY_SET, KEY_ORDER } from '../data/keys.js';

// Matches [token]>[params...] where params are [value] groups
const LINE_RE = /^\[([^\]]+)\]>(.+)$/;
const FN_LINE_RE = /^fn\s+\[([^\]]+)\]>(.+)$/i;
const PARAM_RE = /\[([^\]]+)\]/g;

/**
 * Parse an LED file's text content.
 * @param {string} text - Raw file content
 * @returns {{ effect: object|null, baseColor: object|null, perKeyColors: Array, fnEffect: object|null, fnBaseColor: object|null, fnPerKeyColors: Array, rawLines: Array }}
 */
export function parseLed(text) {
  const result = {
    effect: null,
    baseColor: null,
    perKeyColors: [],
    fnEffect: null,
    fnBaseColor: null,
    fnPerKeyColors: [],
    rawLines: [],
  };

  if (!text || !text.trim()) return result;

  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Try FN line first
    let m = trimmed.match(FN_LINE_RE);
    if (m) {
      const parsed = parseLedLine(m[1], m[2], true, i, result);
      if (!parsed) result.rawLines.push({ index: i, text: line });
      continue;
    }

    // Try regular line
    m = trimmed.match(LINE_RE);
    if (m) {
      const parsed = parseLedLine(m[1], m[2], false, i, result);
      if (!parsed) result.rawLines.push({ index: i, text: line });
      continue;
    }

    // Unrecognized — preserve
    result.rawLines.push({ index: i, text: line });
  }

  // If no effect was found but we have per-key colors, it's Freestyle mode
  if (!result.effect && result.perKeyColors.length > 0) {
    result.effect = { id: 'freestyle', token: null, params: [], lineIndex: undefined };
  }

  return result;
}

/**
 * Parse a single LED line's token and params string.
 * Returns true if recognized, false if should be preserved as raw.
 */
function parseLedLine(token, paramsStr, isFn, lineIndex, result) {
  const tokenLower = token.toLowerCase();
  const params = extractParams(paramsStr);

  // Check if it's a known effect token
  const effectDef = getEffectByToken(tokenLower);

  if (effectDef) {
    // Special case: 'mono' token can be the Monochrome effect OR a base color line.
    // It's a base color when an effect already exists for the target layer.
    if (tokenLower === 'mono') {
      const color = parseRGB(params);
      if (color) {
        if (isFn && result.fnEffect) {
          // FN layer already has an effect → this is FN base color
          result.fnBaseColor = { ...color, lineIndex, hasFnPrefix: true };
          return true;
        } else if (!isFn && result.effect) {
          // Base layer already has an effect
          if (!result.baseColor) {
            // First mono after base effect → base color
            result.baseColor = { ...color, lineIndex };
            return true;
          } else if (result.fnEffect && !result.fnBaseColor) {
            // Base color already set, FN effect exists → FN base color (without fn prefix)
            result.fnBaseColor = { ...color, lineIndex, hasFnPrefix: false };
            return true;
          }
        }
      }
    }

    // It's an effect line — parse inline params
    const effectData = parseEffectParams(effectDef, params, lineIndex);
    if (isFn) {
      result.fnEffect = effectData;
    } else {
      result.effect = effectData;
    }
    return true;
  }

  // Check if it's a per-key color (key token)
  if (KEY_SET.has(tokenLower)) {
    const color = parseRGB(params);
    if (color) {
      const entry = { key: tokenLower, ...color, lineIndex };
      if (isFn) {
        result.fnPerKeyColors.push(entry);
      } else {
        result.perKeyColors.push(entry);
      }
      return true;
    }
  }

  return false;
}

/**
 * Extract all [param] values from a params string.
 */
function extractParams(paramsStr) {
  const params = [];
  let m;
  const re = new RegExp(PARAM_RE.source, 'g');
  while ((m = re.exec(paramsStr)) !== null) {
    params.push(m[1]);
  }
  return params;
}

/**
 * Parse RGB values from the first 3 numeric params.
 */
function parseRGB(params) {
  const nums = params.filter(p => /^\d+$/.test(p)).map(Number);
  if (nums.length >= 3) {
    return { red: nums[0], green: nums[1], blue: nums[2] };
  }
  return null;
}

/**
 * Parse effect-level parameters (color, speed, direction).
 */
function parseEffectParams(effectDef, params, lineIndex) {
  const data = {
    id: effectDef.id,
    token: effectDef.token,
    color: null,
    speed: null,
    direction: null,
    lineIndex,
  };

  // Extract speed
  const spdParam = params.find(p => /^spd[1-9]$/.test(p));
  if (spdParam) data.speed = parseInt(spdParam[3], 10);

  // Extract direction
  const dirParam = params.find(p => /^dir(up|down|left|right)$/.test(p));
  if (dirParam) data.direction = dirParam;

  // Extract color (first 3 consecutive numeric params)
  if (effectDef.hasColor || effectDef.id === 'mono') {
    data.color = parseRGB(params);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

/**
 * Generate an LED file from profile data.
 * @param {ProfileState} profile
 * @returns {string} File content with CRLF line endings
 */
export function generateLed(profile) {
  const entries = [];

  // Base layer effect
  if (profile.effect) {
    const effectLine = formatEffectLine(profile.effect, false);
    if (effectLine) {
      entries.push({ lineIndex: profile.effect.lineIndex ?? 0, text: effectLine });
    }
  }

  // Base layer base color
  if (profile.baseColor) {
    entries.push({
      lineIndex: profile.baseColor.lineIndex ?? 1,
      text: formatBaseColor(profile.baseColor, false),
    });
  }

  // Base layer per-key colors
  for (const pkc of profile.perKeyColors) {
    entries.push({
      lineIndex: pkc.lineIndex ?? Infinity,
      text: formatPerKeyColor(pkc, false),
    });
  }

  // FN layer effect
  if (profile.fnEffect) {
    const effectLine = formatEffectLine(profile.fnEffect, true);
    if (effectLine) {
      entries.push({ lineIndex: profile.fnEffect.lineIndex ?? 100, text: effectLine });
    }
  }

  // FN base color
  if (profile.fnBaseColor) {
    const useFnPrefix = profile.fnBaseColor.hasFnPrefix !== false;
    entries.push({
      lineIndex: profile.fnBaseColor.lineIndex ?? 101,
      text: formatBaseColor(profile.fnBaseColor, useFnPrefix),
    });
  }

  // FN per-key colors
  for (const pkc of profile.fnPerKeyColors) {
    entries.push({
      lineIndex: pkc.lineIndex ?? Infinity,
      text: formatPerKeyColor(pkc, true),
    });
  }

  // Raw lines
  for (const raw of profile.rawLighting) {
    entries.push({ lineIndex: raw.index, text: raw.text });
  }

  // Sort by original line index
  entries.sort((a, b) => a.lineIndex - b.lineIndex);

  const lines = entries.map(e => e.text);
  if (lines.length === 0) return '';
  return lines.join('\r\n') + '\r\n';
}

function formatEffectLine(effect, isFn) {
  // Freestyle has no effect line
  if (!effect.token) return null;

  const fn = isFn ? 'fn ' : '';
  const params = [];

  // Color params (3 RGB values) come first for effects with color
  if (effect.color) {
    params.push(`[${effect.color.red}]`);
    params.push(`[${effect.color.green}]`);
    params.push(`[${effect.color.blue}]`);
  }

  // Speed
  if (effect.speed) {
    params.push(`[spd${effect.speed}]`);
  }

  // Direction
  if (effect.direction) {
    params.push(`[${effect.direction}]`);
  }

  return `${fn}[${effect.token}]>${params.join('')}`;
}

function formatBaseColor(color, isFn) {
  const fn = isFn ? 'fn ' : '';
  return `${fn}[mono]>[${color.red}][${color.green}][${color.blue}]`;
}

function formatPerKeyColor(pkc, isFn) {
  const fn = isFn ? 'fn ' : '';
  return `${fn}[${pkc.key}]>[${pkc.red}][${pkc.green}][${pkc.blue}]`;
}
