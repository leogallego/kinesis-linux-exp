/**
 * Keyboard settings panel — renders controls for all kbd_settings.txt fields.
 */

import { state, saveSettings, showToast } from '../app.js';

let _container = null;

/** Known settings with display config */
const SETTING_DEFS = [
  { key: 'startup_file', label: 'Startup Profile', type: 'select', options: () => {
    const opts = [];
    for (let i = 1; i <= 9; i++) opts.push({ value: `layout${i}.txt`, label: `Profile ${i}` });
    return opts;
  }},
  { key: 'led_mode', label: 'LED Profile', type: 'select', options: () => {
    const opts = [];
    for (let i = 1; i <= 9; i++) opts.push({ value: `led${i}.txt`, label: `LED ${i}` });
    return opts;
  }},
  { key: 'macro_speed', label: 'Macro Speed', type: 'number', min: 1, max: 9 },
  { key: 'status_play_speed', label: 'Status Play Speed', type: 'number', min: 1, max: 9 },
  { key: 'game_mode', label: 'Game Mode', type: 'toggle' },
  { key: 'profile_sync_mode', label: 'Profile Sync Mode', type: 'toggle' },
  { key: 'program_key_lock', label: 'Program Key Lock', type: 'toggle' },
  { key: 'v_drive', label: 'V-Drive', type: 'select', options: () => [
    { value: 'auto', label: 'Auto' },
    { value: 'manual', label: 'Manual' },
  ]},
];

export function initSettingsPanel() {
  _container = document.getElementById('settings-container');
  renderSettings();
}

export function refreshSettingsPanel() {
  renderSettings();
}

function renderSettings() {
  _container.innerHTML = '';

  if (!state.settings || !state.settings.fields) {
    const info = document.createElement('p');
    info.className = 'effect-info';
    info.textContent = 'Open a directory to view keyboard settings.';
    _container.appendChild(info);
    return;
  }

  const fields = state.settings.fields;

  for (const def of SETTING_DEFS) {
    if (!(def.key in fields)) continue;

    const group = document.createElement('div');
    group.className = 'effect-param';

    const lbl = document.createElement('label');
    lbl.textContent = def.label;
    group.appendChild(lbl);

    if (def.type === 'toggle') {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isOn = fields[def.key].toUpperCase() === 'ON';
      btn.textContent = isOn ? 'ON' : 'OFF';
      btn.className = 'settings-toggle' + (isOn ? ' settings-toggle--on' : '');
      btn.addEventListener('click', () => {
        const newVal = fields[def.key].toUpperCase() === 'ON' ? 'OFF' : 'ON';
        fields[def.key] = newVal;
        btn.textContent = newVal;
        btn.classList.toggle('settings-toggle--on', newVal === 'ON');
      });
      group.appendChild(btn);
    } else if (def.type === 'number') {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = def.min;
      input.max = def.max;
      input.value = fields[def.key];
      input.className = 'macro-input';
      input.addEventListener('change', () => {
        fields[def.key] = input.value;
      });
      group.appendChild(input);
    } else if (def.type === 'select') {
      const select = document.createElement('select');
      select.className = 'effect-select';
      const options = def.options();
      for (const opt of options) {
        const optEl = document.createElement('option');
        optEl.value = opt.value;
        optEl.textContent = opt.label;
        if (fields[def.key] === opt.value) optEl.selected = true;
        select.appendChild(optEl);
      }
      select.addEventListener('change', () => {
        fields[def.key] = select.value;
      });
      group.appendChild(select);
    }

    _container.appendChild(group);
  }

  // Show any unknown fields as read-only
  const knownKeys = new Set(SETTING_DEFS.map(d => d.key));
  for (const [key, value] of Object.entries(fields)) {
    if (knownKeys.has(key)) continue;

    const group = document.createElement('div');
    group.className = 'effect-param';
    const lbl = document.createElement('label');
    lbl.textContent = key;
    group.appendChild(lbl);
    const val = document.createElement('span');
    val.className = 'effect-param-value';
    val.textContent = value;
    group.appendChild(val);
    _container.appendChild(group);
  }

  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save Settings';
  saveBtn.className = 'macro-save-btn';
  saveBtn.style.marginTop = '12px';
  saveBtn.addEventListener('click', async () => {
    await saveSettings();
  });
  _container.appendChild(saveBtn);
}
