/**
 * Layout file parser and generator for Freestyle Edge RGB.
 * Handles remaps, macros, tap-and-hold, and disabled lines.
 * Per contracts/file-formats.md.
 */

const REMAP_RE = /^\[([^\]]+)\]>\[([^\]]+)\]$/;
const FN_REMAP_RE = /^fn\s+\[([^\]]+)\]>\[([^\]]+)\]$/i;
const TAH_RE = /^\[([^\]]+)\]>\[([^\]]+)\]\[t&h(\d{1,3})\]\[([^\]]+)\]$/;
const FN_TAH_RE = /^fn\s+\[([^\]]+)\]>\[([^\]]+)\]\[t&h(\d{1,3})\]\[([^\]]+)\]$/i;
const MACRO_RE = /^\{([^}]+)\}(\{([^}]+)\})?>\{?(.+)$/;
const FN_MACRO_RE = /^fn\s+\{([^}]+)\}(\{([^}]+)\})?>\{?(.+)$/i;

/**
 * Parse a layout file's text content.
 * @param {string} text - Raw file content
 * @returns {{ remaps: Remap[], macros: Macro[], tapAndHolds: TapAndHold[], rawLines: {index: number, text: string}[] }}
 */
export function parseLayout(text) {
  const remaps = [];
  const macros = [];
  const tapAndHolds = [];
  const rawLines = [];

  if (!text || !text.trim()) {
    return { remaps, macros, tapAndHolds, rawLines };
  }

  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Disabled line
    const isDisabled = trimmed.startsWith('*');
    const content = isDisabled ? trimmed.slice(1) : trimmed;

    // FN Tap-and-Hold
    let m = content.match(FN_TAH_RE);
    if (m) {
      tapAndHolds.push({
        position: m[1].toLowerCase(),
        tapAction: m[2].toLowerCase(),
        delayMs: parseInt(m[3], 10),
        holdAction: m[4].toLowerCase(),
        isFn: true,
        disabled: isDisabled,
        lineIndex: i,
      });
      continue;
    }

    // Tap-and-Hold
    m = content.match(TAH_RE);
    if (m) {
      tapAndHolds.push({
        position: m[1].toLowerCase(),
        tapAction: m[2].toLowerCase(),
        delayMs: parseInt(m[3], 10),
        holdAction: m[4].toLowerCase(),
        isFn: false,
        disabled: isDisabled,
        lineIndex: i,
      });
      continue;
    }

    // FN Remap
    m = content.match(FN_REMAP_RE);
    if (m) {
      remaps.push({
        position: m[1].toLowerCase(),
        action: m[2].toLowerCase(),
        isFn: true,
        disabled: isDisabled,
        lineIndex: i,
      });
      continue;
    }

    // Remap
    m = content.match(REMAP_RE);
    if (m) {
      remaps.push({
        position: m[1].toLowerCase(),
        action: m[2].toLowerCase(),
        isFn: false,
        disabled: isDisabled,
        lineIndex: i,
      });
      continue;
    }

    // FN Macro
    m = content.match(FN_MACRO_RE);
    if (m) {
      macros.push(parseMacroContent(m[1], m[3] || null, m[4], true, isDisabled, i));
      continue;
    }

    // Macro
    m = content.match(MACRO_RE);
    if (m) {
      macros.push(parseMacroContent(m[1], m[3] || null, m[4], false, isDisabled, i));
      continue;
    }

    // Unrecognized — preserve verbatim
    rawLines.push({ index: i, text: line });
  }

  return { remaps, macros, tapAndHolds, rawLines };
}

/**
 * Parse macro action content after the '>'.
 */
function parseMacroContent(trigger, coTrigger, actionStr, isFn, disabled, lineIndex) {
  let speed = null;
  let multiplay = null;
  const actions = [];

  // Extract individual tokens from curly braces
  const tokens = [];
  const tokenRe = /\{([^}]+)\}/g;
  let tm;
  // If actionStr doesn't start with {, wrap it
  const normalized = actionStr.startsWith('{') ? actionStr : `{${actionStr}`;
  while ((tm = tokenRe.exec(normalized)) !== null) {
    tokens.push(tm[1]);
  }

  for (const tok of tokens) {
    if (/^s_[1-9]$/.test(tok)) {
      speed = parseInt(tok[2], 10);
    } else if (/^x_[1-9]$/.test(tok)) {
      multiplay = parseInt(tok[2], 10);
    } else {
      actions.push(tok.toLowerCase());
    }
  }

  return {
    trigger: trigger.toLowerCase(),
    coTrigger: coTrigger ? coTrigger.toLowerCase() : null,
    actions,
    speed,
    multiplay,
    isFn,
    disabled,
    lineIndex,
  };
}

/**
 * Generate a layout file from profile data.
 * @param {ProfileState} profile
 * @returns {string} File content with CRLF line endings
 */
export function generateLayout(profile) {
  // Build an ordered list of all entries with their original line indices
  const entries = [];

  for (const r of profile.remaps) {
    entries.push({ lineIndex: r.lineIndex ?? Infinity, text: formatRemap(r) });
  }

  for (const th of profile.tapAndHolds) {
    entries.push({ lineIndex: th.lineIndex ?? Infinity, text: formatTapAndHold(th) });
  }

  for (const m of profile.macros) {
    entries.push({ lineIndex: m.lineIndex ?? Infinity, text: formatMacro(m) });
  }

  for (const raw of profile.rawLayout) {
    entries.push({ lineIndex: raw.index, text: raw.text });
  }

  // Sort by original line index to preserve order
  entries.sort((a, b) => a.lineIndex - b.lineIndex);

  // New entries (Infinity lineIndex) go at end, remaps first then macros
  const lines = entries.map(e => e.text);

  if (lines.length === 0) return '';

  return lines.join('\r\n') + '\r\n';
}

function formatRemap(r) {
  const prefix = r.disabled ? '*' : '';
  const fn = r.isFn ? 'fn ' : '';
  return `${prefix}${fn}[${r.position}]>[${r.action}]`;
}

function formatTapAndHold(th) {
  const prefix = th.disabled ? '*' : '';
  const fn = th.isFn ? 'fn ' : '';
  return `${prefix}${fn}[${th.position}]>[${th.tapAction}][t&h${th.delayMs}][${th.holdAction}]`;
}

function formatMacro(m) {
  const prefix = m.disabled ? '*' : '';
  const fn = m.isFn ? 'fn ' : '';
  const coTrig = m.coTrigger ? `{${m.coTrigger}}` : '';
  const speedPart = m.speed ? `{s_${m.speed}}` : '';
  const multiPart = m.multiplay ? `{x_${m.multiplay}}` : '';
  const actionParts = m.actions.map(a => `{${a}}`).join('');
  return `${prefix}${fn}{${m.trigger}}${coTrig}>${speedPart}${multiPart}${actionParts}`;
}
