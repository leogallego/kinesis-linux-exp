/**
 * Per-key color picker — when Freestyle or Breathe effect is active,
 * clicking a key opens a color picker for that specific key.
 */

import { state, markDirty, refreshUI } from '../app.js';
import { onKeySelected, setKeyColor } from './keyboard-view.js';
import { getEffectById } from '../data/effects.js';

let _containerEl = null;
let _colorInput = null;

export function initColorPicker() {
  _containerEl = document.getElementById('color-picker-container');

  onKeySelected((token) => {
    if (state.activePanelTab === 'lighting') {
      renderPerKeyPicker(token);
    }
  });
}

export function refreshPerKeyColors() {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const isFn = state.activeLayer === 'fn';
  const effect = isFn ? profile.fnEffect : profile.effect;
  const effDef = effect ? getEffectById(effect.id) : null;

  if (effDef && effDef.hasPerKeyColors) {
    const colors = isFn ? profile.fnPerKeyColors : profile.perKeyColors;
    for (const pkc of colors) {
      setKeyColor(pkc.key, `rgb(${pkc.red}, ${pkc.green}, ${pkc.blue})`);
    }
  }
}

function renderPerKeyPicker(keyToken) {
  _containerEl.innerHTML = '';

  const profile = state.profiles[state.activeProfile];
  if (!profile || !keyToken) return;

  const isFn = state.activeLayer === 'fn';
  const effect = isFn ? profile.fnEffect : profile.effect;
  const effDef = effect ? getEffectById(effect.id) : null;

  if (!effDef || !effDef.hasPerKeyColors) {
    _containerEl.innerHTML = '<p class="effect-info">Per-key colors not available for this effect.</p>';
    return;
  }

  const colors = isFn ? profile.fnPerKeyColors : profile.perKeyColors;
  const existing = colors.find(c => c.key === keyToken);

  const group = document.createElement('div');
  group.className = 'effect-param';

  const lbl = document.createElement('label');
  lbl.textContent = `Color for ${keyToken}`;
  group.appendChild(lbl);

  const hex = existing
    ? rgbToHex(existing.red, existing.green, existing.blue)
    : '#ffffff';

  const input = document.createElement('input');
  input.type = 'color';
  input.value = hex;
  input.className = 'effect-color-input';

  input.addEventListener('input', () => {
    const c = hexToRgb(input.value);
    assignPerKeyColor(keyToken, c, isFn);
  });

  group.appendChild(input);
  _containerEl.appendChild(group);
}

function assignPerKeyColor(keyToken, color, isFn) {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const colors = isFn ? profile.fnPerKeyColors : profile.perKeyColors;
  const existing = colors.find(c => c.key === keyToken);

  if (existing) {
    existing.red = color.red;
    existing.green = color.green;
    existing.blue = color.blue;
  } else {
    colors.push({
      key: keyToken,
      red: color.red,
      green: color.green,
      blue: color.blue,
      lineIndex: undefined,
    });
  }

  setKeyColor(keyToken, `rgb(${color.red}, ${color.green}, ${color.blue})`);
  markDirty();
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? { red: parseInt(m[1], 16), green: parseInt(m[2], 16), blue: parseInt(m[3], 16) } : { red: 0, green: 0, blue: 0 };
}
