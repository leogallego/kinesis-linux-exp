/**
 * Lighting effect selector panel — dropdown for effect selection
 * with parameter controls (color, speed, direction).
 */

import { EFFECTS, SPEED_TOKENS, DIRECTION_TOKENS, getEffectById } from '../data/effects.js';
import { state, markDirty } from '../app.js';

let _containerEl = null;

export function initEffectSelector() {
  _containerEl = document.getElementById('effect-selector-container');
  renderEffectSelector();
}

export function refreshEffectSelector() {
  renderEffectSelector();
}

function renderEffectSelector() {
  _containerEl.innerHTML = '';

  const profile = state.profiles[state.activeProfile];
  const isFn = state.activeLayer === 'fn';
  const currentEffect = isFn
    ? (profile?.fnEffect ?? null)
    : (profile?.effect ?? null);

  // Effect dropdown
  const label = document.createElement('label');
  label.className = 'effect-label';
  label.textContent = 'Effect';

  const select = document.createElement('select');
  select.className = 'effect-select';
  for (const eff of EFFECTS) {
    const opt = document.createElement('option');
    opt.value = eff.id;
    opt.textContent = eff.label;
    if (currentEffect && currentEffect.id === eff.id) opt.selected = true;
    select.appendChild(opt);
  }

  // If no effect loaded, select first (Freestyle)
  if (!currentEffect) select.value = EFFECTS[0].id;

  select.addEventListener('change', () => {
    applyEffect(select.value);
  });

  _containerEl.appendChild(label);
  _containerEl.appendChild(select);

  // Parameter controls based on selected effect
  const effDef = getEffectById(currentEffect?.id || select.value);
  if (!effDef) return;

  // Speed slider
  if (effDef.hasSpeed) {
    const speedVal = currentEffect?.speed || 5;
    const speedGroup = createParamGroup('Speed', speedVal, 1, 9, (val) => {
      setEffectParam('speed', val);
    });
    _containerEl.appendChild(speedGroup);
  }

  // Direction buttons
  if (effDef.hasDirection) {
    const dirVal = currentEffect?.direction || 'dirdown';
    const dirGroup = createDirectionGroup(dirVal, (val) => {
      setEffectParam('direction', val);
    });
    _containerEl.appendChild(dirGroup);
  }

  // Effect-level color
  if (effDef.hasColor || effDef.id === 'mono') {
    const color = currentEffect?.color || { red: 255, green: 255, blue: 255 };
    const colorGroup = createColorGroup('Effect Color', color, (c) => {
      setEffectParam('color', c);
    });
    _containerEl.appendChild(colorGroup);
  }

  // Base color (two-tone effects)
  if (effDef.hasBaseColor) {
    const baseColor = isFn
      ? (profile?.fnBaseColor || { red: 0, green: 0, blue: 0 })
      : (profile?.baseColor || { red: 0, green: 0, blue: 0 });
    const baseGroup = createColorGroup('Base Color', baseColor, (c) => {
      if (!profile) return;
      if (isFn) {
        profile.fnBaseColor = { ...c, lineIndex: profile.fnBaseColor?.lineIndex, hasFnPrefix: profile.fnBaseColor?.hasFnPrefix ?? true };
      } else {
        profile.baseColor = { ...c, lineIndex: profile.baseColor?.lineIndex };
      }
      markDirty();
    });
    _containerEl.appendChild(baseGroup);
  }

  // Per-key color info
  if (effDef.hasPerKeyColors) {
    const info = document.createElement('p');
    info.className = 'effect-info';
    info.textContent = 'Click keys on the keyboard to assign individual colors.';
    _containerEl.appendChild(info);
  }
}

function applyEffect(effectId) {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const effDef = getEffectById(effectId);
  if (!effDef) return;

  const isFn = state.activeLayer === 'fn';
  const existingEffect = isFn ? profile.fnEffect : profile.effect;

  const newEffect = {
    id: effDef.id,
    token: effDef.token,
    color: effDef.hasColor || effDef.id === 'mono'
      ? (existingEffect?.color || { red: 255, green: 255, blue: 255 })
      : null,
    speed: effDef.hasSpeed ? (existingEffect?.speed || 5) : null,
    direction: effDef.hasDirection ? (existingEffect?.direction || 'dirdown') : null,
    lineIndex: existingEffect?.lineIndex,
  };

  if (isFn) {
    profile.fnEffect = newEffect;
  } else {
    profile.effect = newEffect;
  }

  markDirty();
  renderEffectSelector();
}

function setEffectParam(param, value) {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const isFn = state.activeLayer === 'fn';
  const effect = isFn ? profile.fnEffect : profile.effect;
  if (!effect) return;

  effect[param] = value;
  markDirty();
}

function createParamGroup(labelText, value, min, max, onChange) {
  const group = document.createElement('div');
  group.className = 'effect-param';

  const lbl = document.createElement('label');
  lbl.textContent = labelText;

  const input = document.createElement('input');
  input.type = 'range';
  input.min = min;
  input.max = max;
  input.value = value;
  input.className = 'effect-slider';

  const valSpan = document.createElement('span');
  valSpan.className = 'effect-param-value';
  valSpan.textContent = value;

  input.addEventListener('input', () => {
    valSpan.textContent = input.value;
    onChange(parseInt(input.value, 10));
  });

  group.appendChild(lbl);
  group.appendChild(input);
  group.appendChild(valSpan);
  return group;
}

function createDirectionGroup(value, onChange) {
  const group = document.createElement('div');
  group.className = 'effect-param';

  const lbl = document.createElement('label');
  lbl.textContent = 'Direction';
  group.appendChild(lbl);

  const btnContainer = document.createElement('div');
  btnContainer.className = 'direction-btns';

  const dirs = [
    { token: 'dirup', label: '\u2191' },
    { token: 'dirdown', label: '\u2193' },
    { token: 'dirleft', label: '\u2190' },
    { token: 'dirright', label: '\u2192' },
  ];

  for (const dir of dirs) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = dir.label;
    btn.className = 'direction-btn' + (dir.token === value ? ' active' : '');
    btn.addEventListener('click', () => {
      for (const b of btnContainer.querySelectorAll('.direction-btn')) b.classList.remove('active');
      btn.classList.add('active');
      onChange(dir.token);
    });
    btnContainer.appendChild(btn);
  }

  group.appendChild(btnContainer);
  return group;
}

function createColorGroup(labelText, color, onChange) {
  const group = document.createElement('div');
  group.className = 'effect-param';

  const lbl = document.createElement('label');
  lbl.textContent = labelText;
  group.appendChild(lbl);

  const hex = rgbToHex(color.red, color.green, color.blue);
  const input = document.createElement('input');
  input.type = 'color';
  input.value = hex;
  input.className = 'effect-color-input';

  input.addEventListener('input', () => {
    const c = hexToRgb(input.value);
    onChange(c);
  });

  group.appendChild(input);
  return group;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? { red: parseInt(m[1], 16), green: parseInt(m[2], 16), blue: parseInt(m[3], 16) } : { red: 0, green: 0, blue: 0 };
}
