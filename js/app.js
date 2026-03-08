import { KEY_POSITIONS } from './data/keys.js';
import { ACTION_TOKENS, isValidAction } from './data/actions.js';
import { EFFECTS } from './data/effects.js';
import { parseLayout, generateLayout } from './parsers/layout-parser.js';
import { parseLed, generateLed } from './parsers/led-parser.js';
import { parseSettings, generateSettings } from './parsers/settings-parser.js';
import { openDirectory, readFile, writeFile, ensureSubdir, isFileSystemAccessSupported } from './io/file-access.js';
import { uploadDirectory, downloadFile } from './io/file-fallback.js';
import { initKeyboardView, resetKeyStates } from './ui/keyboard-view.js';
import { initActionPicker, refreshRemapIndicators } from './ui/key-item.js';
import { initEffectSelector } from './ui/effect-selector.js';
import { initColorPicker } from './ui/color-picker.js';
import { initMacroEditor } from './ui/macro-editor.js';
import { initProfileTabs } from './ui/profile-tabs.js';
import { initSettingsPanel } from './ui/settings-panel.js';

// ---------------------------------------------------------------------------
// Application State
// ---------------------------------------------------------------------------

/** @type {AppState} */
export const state = {
  /** @type {FileSystemDirectoryHandle|null} */
  dirHandle: null,
  /** @type {Map<string, File[]>|null} fallback uploaded files */
  uploadedFiles: null,

  activeProfile: 1,
  activePanelTab: 'keys',
  activeLayer: 'base',  // 'base' | 'fn'

  /** @type {string|null} currently selected key token */
  selectedKey: null,

  /** @type {Object.<number, ProfileState>} keyed by profile number 1-9 */
  profiles: {},

  /** @type {KeyboardSettings|null} */
  settings: null,
};

/**
 * Create an empty profile state.
 * @param {number} num
 * @returns {ProfileState}
 */
export function createEmptyProfile(num) {
  return {
    number: num,
    remaps: [],
    macros: [],
    tapAndHolds: [],
    effect: null,
    fnEffect: null,
    perKeyColors: [],
    fnPerKeyColors: [],
    baseColor: null,
    rawLayout: [],
    rawLighting: [],
    dirty: false,
  };
}

// ---------------------------------------------------------------------------
// Toast notifications
// ---------------------------------------------------------------------------

let toastTimer = null;

export function showToast(message, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = `toast toast--${type}`;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3000);
}

// ---------------------------------------------------------------------------
// Directory I/O
// ---------------------------------------------------------------------------

async function handleOpen() {
  try {
    state.dirHandle = await openDirectory();
    state.uploadedFiles = null;
    document.getElementById('status-dir').textContent = 'Directory open';
    document.getElementById('btn-save').disabled = false;
    await loadProfile(state.activeProfile);
    await loadSettings();
    showToast('Directory opened');
  } catch (err) {
    if (err.name !== 'AbortError') {
      showToast('Failed to open directory: ' + err.message, 'error');
    }
  }
}

async function handleUpload(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  state.dirHandle = null;
  state.uploadedFiles = new Map();
  for (const f of files) {
    const parts = f.webkitRelativePath.split('/');
    const subdir = parts.length > 2 ? parts[parts.length - 2] : '';
    if (!state.uploadedFiles.has(subdir)) state.uploadedFiles.set(subdir, []);
    state.uploadedFiles.get(subdir).push(f);
  }
  document.getElementById('status-dir').textContent = 'Files uploaded';
  document.getElementById('btn-save').disabled = false;
  await loadProfile(state.activeProfile);
  await loadSettings();
  showToast('Files loaded');
}

// ---------------------------------------------------------------------------
// Profile Loading / Saving
// ---------------------------------------------------------------------------

export async function loadProfile(num) {
  const profile = state.profiles[num] || createEmptyProfile(num);
  state.profiles[num] = profile;

  // Load layout
  const layoutText = await readProfileFile('layouts', `layout${num}.txt`);
  if (layoutText !== null) {
    const parsed = parseLayout(layoutText);
    profile.remaps = parsed.remaps;
    profile.macros = parsed.macros;
    profile.tapAndHolds = parsed.tapAndHolds;
    profile.rawLayout = parsed.rawLines;
  }

  // Load lighting
  const ledText = await readProfileFile('lighting', `led${num}.txt`);
  if (ledText !== null) {
    const parsed = parseLed(ledText);
    profile.effect = parsed.effect;
    profile.fnEffect = parsed.fnEffect;
    profile.perKeyColors = parsed.perKeyColors;
    profile.fnPerKeyColors = parsed.fnPerKeyColors;
    profile.baseColor = parsed.baseColor;
    profile.rawLighting = parsed.rawLines;
  }

  profile.dirty = false;
  refreshUI();
}

export async function saveProfile(num) {
  const profile = state.profiles[num];
  if (!profile) return;

  const layoutText = generateLayout(profile);
  const ledText = generateLed(profile);

  try {
    if (state.dirHandle) {
      await ensureSubdir(state.dirHandle, 'layouts');
      await writeFile(state.dirHandle, 'layouts', `layout${num}.txt`, layoutText);
      await ensureSubdir(state.dirHandle, 'lighting');
      await writeFile(state.dirHandle, 'lighting', `led${num}.txt`, ledText);
    } else {
      downloadFile(`layout${num}.txt`, layoutText);
      downloadFile(`led${num}.txt`, ledText);
    }
    profile.dirty = false;
    showToast(`Profile ${num} saved`);
    refreshUI();
  } catch (err) {
    showToast('Save failed: ' + err.message, 'error');
  }
}

async function loadSettings() {
  const text = await readProfileFile('settings', 'kbd_settings.txt');
  if (text !== null) {
    state.settings = parseSettings(text);
  }
}

export async function saveSettings() {
  if (!state.settings) return;
  const text = generateSettings(state.settings);
  try {
    if (state.dirHandle) {
      await ensureSubdir(state.dirHandle, 'settings');
      await writeFile(state.dirHandle, 'settings', 'kbd_settings.txt', text);
    } else {
      downloadFile('kbd_settings.txt', text);
    }
    showToast('Settings saved');
  } catch (err) {
    showToast('Settings save failed: ' + err.message, 'error');
  }
}

/**
 * Read a file from the working directory or uploaded files.
 * Returns null if file not found.
 */
async function readProfileFile(subdir, filename) {
  try {
    if (state.dirHandle) {
      return await readFile(state.dirHandle, subdir, filename);
    } else if (state.uploadedFiles) {
      const files = state.uploadedFiles.get(subdir) || [];
      const file = files.find(f => f.name === filename);
      if (file) return await file.text();
    }
  } catch {
    // File not found — return null
  }
  return null;
}

// ---------------------------------------------------------------------------
// UI State Management
// ---------------------------------------------------------------------------

export function markDirty() {
  const profile = state.profiles[state.activeProfile];
  if (profile) {
    profile.dirty = true;
    refreshUI();
  }
}

export function refreshUI() {
  // Reset keyboard view then reapply indicators
  resetKeyStates();
  refreshRemapIndicators();
}

/**
 * Validate all remaps in the current profile have valid action tokens.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateProfile() {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return { valid: true, errors: [] };

  const errors = [];
  for (const r of profile.remaps) {
    if (!r.disabled && !isValidAction(r.action)) {
      errors.push(`Invalid action token "${r.action}" for key [${r.position}]`);
    }
  }
  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Panel Tab Switching
// ---------------------------------------------------------------------------

function switchPanelTab(tab) {
  state.activePanelTab = tab;
  const panels = { keys: 'panel-action', lighting: 'panel-lighting', macros: 'panel-macros', settings: 'panel-settings' };
  for (const [key, id] of Object.entries(panels)) {
    document.getElementById(id).hidden = key !== tab;
  }
  for (const btn of document.querySelectorAll('.panel-nav__btn')) {
    btn.classList.toggle('active', btn.id === `btn-tab-${tab}`);
  }
}

// ---------------------------------------------------------------------------
// Layer Switching
// ---------------------------------------------------------------------------

function switchLayer(layer) {
  state.activeLayer = layer;
  document.getElementById('btn-layer-base').classList.toggle('active', layer === 'base');
  document.getElementById('btn-layer-fn').classList.toggle('active', layer === 'fn');
  document.getElementById('btn-layer-base').setAttribute('aria-pressed', layer === 'base');
  document.getElementById('btn-layer-fn').setAttribute('aria-pressed', layer === 'fn');
  refreshUI();
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const useNativeFS = isFileSystemAccessSupported();

  // Directory open / upload
  const btnOpen = document.getElementById('btn-open');
  const labelUpload = document.getElementById('label-upload');
  const inputUpload = document.getElementById('input-upload');

  if (useNativeFS) {
    btnOpen.addEventListener('click', handleOpen);
    labelUpload.hidden = true;
  } else {
    btnOpen.hidden = true;
    labelUpload.hidden = false;
    inputUpload.addEventListener('change', handleUpload);
  }

  // Save (with validation — FR-015)
  document.getElementById('btn-save').addEventListener('click', async () => {
    const { valid, errors } = validateProfile();
    if (!valid) {
      showToast('Validation failed: ' + errors[0], 'error');
      return;
    }
    await saveProfile(state.activeProfile);
    if (state.settings) await saveSettings();
  });

  // Panel tabs
  for (const tab of ['keys', 'lighting', 'macros', 'settings']) {
    document.getElementById(`btn-tab-${tab}`).addEventListener('click', () => switchPanelTab(tab));
  }
  switchPanelTab('keys');

  // Layer toggle
  document.getElementById('btn-layer-base').addEventListener('click', () => switchLayer('base'));
  document.getElementById('btn-layer-fn').addEventListener('click', () => switchLayer('fn'));

  // Initialize UI modules
  initKeyboardView();
  initActionPicker();
  initEffectSelector();
  initColorPicker();
  initMacroEditor();
  initProfileTabs();
  initSettingsPanel();
});
