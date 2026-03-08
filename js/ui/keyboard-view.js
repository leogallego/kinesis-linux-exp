/**
 * SVG keyboard renderer.
 * Loads the keyboard-layout.svg, attaches click handlers,
 * and manages key selection and per-key coloring.
 */

import { KEY_POSITIONS, getKeyByToken } from '../data/keys.js';
import { state } from '../app.js';

let _container = null;
let _svgDoc = null;
let _onKeySelectedCallbacks = [];

/**
 * Initialize the keyboard view by loading the SVG.
 */
export function initKeyboardView() {
  _container = document.getElementById('keyboard-container');
  loadSVG();
}

async function loadSVG() {
  try {
    const resp = await fetch('assets/keyboard-layout.svg');
    const svgText = await resp.text();
    _container.innerHTML = svgText;
    _svgDoc = _container.querySelector('svg');
    attachKeyHandlers();
  } catch (err) {
    _container.textContent = 'Failed to load keyboard layout.';
  }
}

function attachKeyHandlers() {
  const keyGroups = _svgDoc.querySelectorAll('g[data-token]');
  for (const group of keyGroups) {
    group.addEventListener('click', () => {
      const token = group.getAttribute('data-token');
      selectKey(token);
    });
  }
}

/**
 * Select a key by its position token.
 * @param {string} token
 */
export function selectKey(token) {
  // Deselect previous
  if (state.selectedKey) {
    const prev = getKeyGroup(state.selectedKey);
    if (prev) prev.querySelector('.key-rect')?.classList.remove('selected');
  }

  state.selectedKey = token;

  // Highlight new selection
  const group = getKeyGroup(token);
  if (group) group.querySelector('.key-rect')?.classList.add('selected');

  // Update selected key label in panel
  const labelEl = document.getElementById('selected-key-label');
  const keyDef = getKeyByToken(token);
  if (labelEl && keyDef) {
    labelEl.textContent = `${keyDef.label} [${keyDef.token}]`;
  }

  for (const cb of _onKeySelectedCallbacks) cb(token);
}

/**
 * Register a callback for key selection events.
 * @param {function(string): void} callback
 */
export function onKeySelected(callback) {
  _onKeySelectedCallbacks.push(callback);
}

/**
 * Set the fill color of a key's rect element.
 * @param {string} token - Position token
 * @param {string} cssColor - CSS color string (e.g., '#ff0000' or 'rgb(255,0,0)')
 */
export function setKeyColor(token, cssColor) {
  const group = getKeyGroup(token);
  if (!group) return;
  const rect = group.querySelector('.key-rect');
  if (rect) {
    rect.style.fill = cssColor;
  }
}

/**
 * Clear custom color from a key, reverting to CSS default.
 * @param {string} token
 */
export function clearKeyColor(token) {
  const group = getKeyGroup(token);
  if (!group) return;
  const rect = group.querySelector('.key-rect');
  if (rect) {
    rect.style.fill = '';
  }
}

/**
 * Clear all custom key colors.
 */
export function clearAllKeyColors() {
  if (!_svgDoc) return;
  for (const rect of _svgDoc.querySelectorAll('.key-rect')) {
    rect.style.fill = '';
  }
}

/**
 * Add or remove the .remapped class on a key.
 * @param {string} token
 * @param {boolean} isRemapped
 */
export function setKeyRemapped(token, isRemapped) {
  const group = getKeyGroup(token);
  if (!group) return;
  const rect = group.querySelector('.key-rect');
  if (rect) {
    rect.classList.toggle('remapped', isRemapped);
  }
}

/**
 * Set tooltip text on a key group.
 * @param {string} token
 * @param {string} text
 */
export function setKeyTooltip(token, text) {
  const group = getKeyGroup(token);
  if (!group) return;
  let title = group.querySelector('title');
  if (!title) {
    title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    group.prepend(title);
  }
  title.textContent = text;
}

/**
 * Update the display label text of a key in the SVG.
 * @param {string} token
 * @param {string} label
 */
export function setKeyLabel(token, label) {
  const group = getKeyGroup(token);
  if (!group) return;
  const text = group.querySelector('.key-label');
  if (text) text.textContent = label;
}

/**
 * Clear all remapped indicators and reset labels to defaults.
 */
export function resetKeyStates() {
  if (!_svgDoc) return;
  for (const rect of _svgDoc.querySelectorAll('.key-rect')) {
    rect.classList.remove('remapped', 'selected');
    rect.style.fill = '';
  }
  // Reset labels
  for (const kp of KEY_POSITIONS) {
    setKeyLabel(kp.token, kp.label);
  }
  state.selectedKey = null;
}

/** Get the SVG <g> element for a key token. */
function getKeyGroup(token) {
  if (!_svgDoc) return null;
  return _svgDoc.querySelector(`g[data-token="${token}"]`);
}
