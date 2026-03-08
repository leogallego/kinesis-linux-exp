/**
 * Macro editor UI — list macros, create/edit/delete macros,
 * tap-and-hold configuration.
 */

import { ACTION_TOKENS, ACTION_CATEGORIES, getActionsByCategory } from '../data/actions.js';
import { KEY_POSITIONS, getKeyByToken } from '../data/keys.js';
import { state, markDirty } from '../app.js';

let _listContainer = null;
let _editorContainer = null;

// Editor state
let _editingMacro = null; // null = creating new, object = editing existing
let _pendingActions = [];
let _pendingTrigger = null;
let _pendingCoTrigger = null;
let _pendingSpeed = null;
let _pendingMultiplay = null;

export function initMacroEditor() {
  _listContainer = document.getElementById('macro-list-container');
  renderMacroPanel();
}

export function refreshMacroList() {
  renderMacroPanel();
}

function renderMacroPanel() {
  _listContainer.innerHTML = '';

  const profile = state.profiles[state.activeProfile];
  const isFn = state.activeLayer === 'fn';

  // "New Macro" button
  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.textContent = '+ New Macro';
  newBtn.className = 'macro-new-btn';
  newBtn.addEventListener('click', () => openEditor(null));
  _listContainer.appendChild(newBtn);

  if (!profile) return;

  // Macros for current layer
  const macros = profile.macros.filter(m => m.isFn === isFn);
  const tapHolds = profile.tapAndHolds.filter(th => th.isFn === isFn);

  if (macros.length > 0) {
    const macroHeading = document.createElement('h3');
    macroHeading.className = 'macro-section-title';
    macroHeading.textContent = 'Macros';
    _listContainer.appendChild(macroHeading);

    for (const macro of macros) {
      _listContainer.appendChild(createMacroItem(macro));
    }
  }

  if (tapHolds.length > 0) {
    const tahHeading = document.createElement('h3');
    tahHeading.className = 'macro-section-title';
    tahHeading.textContent = 'Tap & Hold';
    _listContainer.appendChild(tahHeading);

    for (const th of tapHolds) {
      _listContainer.appendChild(createTapHoldItem(th));
    }
  }

  if (macros.length === 0 && tapHolds.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'effect-info';
    empty.textContent = 'No macros defined for this layer.';
    _listContainer.appendChild(empty);
  }
}

function createMacroItem(macro) {
  const el = document.createElement('div');
  el.className = 'macro-item';

  const triggerLabel = getKeyLabel(macro.trigger);
  const coLabel = macro.coTrigger ? ` + ${getKeyLabel(macro.coTrigger)}` : '';
  const actionSummary = macro.actions.slice(0, 5).map(getKeyLabel).join(', ');
  const more = macro.actions.length > 5 ? ` +${macro.actions.length - 5} more` : '';

  const info = document.createElement('div');
  info.className = 'macro-item__info';
  info.innerHTML = `<strong>${triggerLabel}${coLabel}</strong><br><span class="macro-item__actions">${actionSummary}${more}</span>`;
  if (macro.speed) info.innerHTML += `<br><span class="macro-item__meta">Speed: ${macro.speed}</span>`;
  if (macro.multiplay) info.innerHTML += ` <span class="macro-item__meta">Repeat: ${macro.multiplay}×</span>`;
  if (macro.disabled) el.classList.add('macro-item--disabled');

  const btns = document.createElement('div');
  btns.className = 'macro-item__btns';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.textContent = 'Edit';
  editBtn.className = 'macro-item__btn';
  editBtn.addEventListener('click', () => openEditor(macro));

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.textContent = 'Del';
  delBtn.className = 'macro-item__btn macro-item__btn--del';
  delBtn.addEventListener('click', () => deleteMacro(macro));

  btns.appendChild(editBtn);
  btns.appendChild(delBtn);
  el.appendChild(info);
  el.appendChild(btns);
  return el;
}

function createTapHoldItem(th) {
  const el = document.createElement('div');
  el.className = 'macro-item';

  const posLabel = getKeyLabel(th.position);
  const tapLabel = getKeyLabel(th.tapAction);
  const holdLabel = getKeyLabel(th.holdAction);

  const info = document.createElement('div');
  info.className = 'macro-item__info';
  info.innerHTML = `<strong>${posLabel}</strong><br>` +
    `<span class="macro-item__actions">Tap: ${tapLabel} | Hold: ${holdLabel}</span><br>` +
    `<span class="macro-item__meta">Delay: ${th.delayMs}ms</span>`;
  if (th.disabled) el.classList.add('macro-item--disabled');

  const btns = document.createElement('div');
  btns.className = 'macro-item__btns';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.textContent = 'Edit';
  editBtn.className = 'macro-item__btn';
  editBtn.addEventListener('click', () => openTahEditor(th));

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.textContent = 'Del';
  delBtn.className = 'macro-item__btn macro-item__btn--del';
  delBtn.addEventListener('click', () => deleteTapHold(th));

  btns.appendChild(editBtn);
  btns.appendChild(delBtn);
  el.appendChild(info);
  el.appendChild(btns);
  return el;
}

// ---------------------------------------------------------------------------
// Macro Editor
// ---------------------------------------------------------------------------

function openEditor(macro) {
  _editingMacro = macro;
  _pendingTrigger = macro?.trigger || null;
  _pendingCoTrigger = macro?.coTrigger || null;
  _pendingActions = macro ? [...macro.actions] : [];
  _pendingSpeed = macro?.speed || null;
  _pendingMultiplay = macro?.multiplay || null;

  renderEditor();
}

function renderEditor() {
  _listContainer.innerHTML = '';

  const title = document.createElement('h3');
  title.className = 'macro-section-title';
  title.textContent = _editingMacro ? 'Edit Macro' : 'New Macro';
  _listContainer.appendChild(title);

  // Trigger key selector
  _listContainer.appendChild(createFieldLabel('Trigger Key'));
  const trigSelect = createKeySelect(_pendingTrigger, (val) => {
    _pendingTrigger = val;
  });
  _listContainer.appendChild(trigSelect);

  // Co-trigger (optional modifier)
  _listContainer.appendChild(createFieldLabel('Co-Trigger (optional)'));
  const coSelect = createKeySelect(_pendingCoTrigger, (val) => {
    _pendingCoTrigger = val || null;
  }, true);
  _listContainer.appendChild(coSelect);

  // Speed
  _listContainer.appendChild(createFieldLabel('Speed (1-9, optional)'));
  const speedInput = document.createElement('input');
  speedInput.type = 'number';
  speedInput.min = 1;
  speedInput.max = 9;
  speedInput.value = _pendingSpeed || '';
  speedInput.placeholder = 'Default';
  speedInput.className = 'macro-input';
  speedInput.addEventListener('change', () => {
    const v = parseInt(speedInput.value, 10);
    _pendingSpeed = (v >= 1 && v <= 9) ? v : null;
  });
  _listContainer.appendChild(speedInput);

  // Multiplay
  _listContainer.appendChild(createFieldLabel('Repeat (1-9, optional)'));
  const multiInput = document.createElement('input');
  multiInput.type = 'number';
  multiInput.min = 1;
  multiInput.max = 9;
  multiInput.value = _pendingMultiplay || '';
  multiInput.placeholder = 'Default';
  multiInput.className = 'macro-input';
  multiInput.addEventListener('change', () => {
    const v = parseInt(multiInput.value, 10);
    _pendingMultiplay = (v >= 1 && v <= 9) ? v : null;
  });
  _listContainer.appendChild(multiInput);

  // Action sequence
  _listContainer.appendChild(createFieldLabel('Action Sequence'));
  const seqContainer = document.createElement('div');
  seqContainer.className = 'macro-sequence';
  renderActionSequence(seqContainer);
  _listContainer.appendChild(seqContainer);

  // Add action key selector
  _listContainer.appendChild(createFieldLabel('Add Action'));
  const addSelect = createKeySelect(null, (val) => {
    if (val) {
      _pendingActions.push(val);
      renderActionSequence(seqContainer);
    }
    // Reset dropdown
    addSelect.value = '';
  }, true);
  _listContainer.appendChild(addSelect);

  // Special macro modifiers
  const specialBtns = document.createElement('div');
  specialBtns.className = 'macro-special-btns';
  for (const spec of [
    { token: '-lshft', label: '+Shift' },
    { token: '+lshft', label: '-Shift' },
    { token: '-lctrl', label: '+Ctrl' },
    { token: '+lctrl', label: '-Ctrl' },
    { token: '-lalt', label: '+Alt' },
    { token: '+lalt', label: '-Alt' },
  ]) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = spec.label;
    btn.className = 'macro-special-btn';
    btn.addEventListener('click', () => {
      _pendingActions.push(spec.token);
      renderActionSequence(seqContainer);
    });
    specialBtns.appendChild(btn);
  }
  _listContainer.appendChild(specialBtns);

  // Preview
  _listContainer.appendChild(createFieldLabel('Preview'));
  const preview = document.createElement('code');
  preview.className = 'macro-preview';
  preview.textContent = buildPreviewString();
  _listContainer.appendChild(preview);

  // Save / Cancel buttons
  const btnRow = document.createElement('div');
  btnRow.className = 'macro-btn-row';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = _editingMacro ? 'Update Macro' : 'Save Macro';
  saveBtn.className = 'macro-save-btn';
  saveBtn.addEventListener('click', () => saveMacro());

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => renderMacroPanel());

  btnRow.appendChild(saveBtn);
  btnRow.appendChild(cancelBtn);
  _listContainer.appendChild(btnRow);
}

function renderActionSequence(container) {
  container.innerHTML = '';
  if (_pendingActions.length === 0) {
    container.textContent = '(empty)';
    return;
  }

  for (let i = 0; i < _pendingActions.length; i++) {
    const tag = document.createElement('span');
    tag.className = 'macro-action-tag';
    tag.textContent = getKeyLabel(_pendingActions[i]);
    tag.title = _pendingActions[i];

    const removeBtn = document.createElement('span');
    removeBtn.className = 'macro-action-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      _pendingActions.splice(i, 1);
      renderActionSequence(container);
      // Update preview
      const preview = _listContainer.querySelector('.macro-preview');
      if (preview) preview.textContent = buildPreviewString();
    });

    tag.appendChild(removeBtn);
    container.appendChild(tag);
  }
}

function buildPreviewString() {
  if (!_pendingTrigger) return '(select a trigger key)';
  const coTrig = _pendingCoTrigger ? `{${_pendingCoTrigger}}` : '';
  const speed = _pendingSpeed ? `{s_${_pendingSpeed}}` : '';
  const multi = _pendingMultiplay ? `{x_${_pendingMultiplay}}` : '';
  const actions = _pendingActions.map(a => `{${a}}`).join('');
  const fn = state.activeLayer === 'fn' ? 'fn ' : '';
  return `${fn}{${_pendingTrigger}}${coTrig}>${speed}${multi}${actions}`;
}

function saveMacro() {
  if (!_pendingTrigger) return;
  if (_pendingActions.length === 0) return;

  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const isFn = state.activeLayer === 'fn';
  const macroData = {
    trigger: _pendingTrigger,
    coTrigger: _pendingCoTrigger,
    actions: [..._pendingActions],
    speed: _pendingSpeed,
    multiplay: _pendingMultiplay,
    isFn,
    disabled: _editingMacro?.disabled || false,
    lineIndex: _editingMacro?.lineIndex,
  };

  if (_editingMacro) {
    // Replace existing
    const idx = profile.macros.indexOf(_editingMacro);
    if (idx >= 0) profile.macros[idx] = macroData;
  } else {
    profile.macros.push(macroData);
  }

  markDirty();
  _editingMacro = null;
  renderMacroPanel();
}

function deleteMacro(macro) {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const idx = profile.macros.indexOf(macro);
  if (idx >= 0) {
    profile.macros.splice(idx, 1);
    markDirty();
    renderMacroPanel();
  }
}

// ---------------------------------------------------------------------------
// Tap-and-Hold Editor
// ---------------------------------------------------------------------------

function openTahEditor(th) {
  _listContainer.innerHTML = '';

  let pendingPosition = th?.position || null;
  let pendingTap = th?.tapAction || null;
  let pendingHold = th?.holdAction || null;
  let pendingDelay = th?.delayMs || 200;

  const title = document.createElement('h3');
  title.className = 'macro-section-title';
  title.textContent = th ? 'Edit Tap & Hold' : 'New Tap & Hold';
  _listContainer.appendChild(title);

  // Position key
  _listContainer.appendChild(createFieldLabel('Key Position'));
  const posSelect = createKeySelect(pendingPosition, (val) => { pendingPosition = val; });
  _listContainer.appendChild(posSelect);

  // Tap action
  _listContainer.appendChild(createFieldLabel('Tap Action'));
  const tapSelect = createActionSelect(pendingTap, (val) => { pendingTap = val; });
  _listContainer.appendChild(tapSelect);

  // Hold action
  _listContainer.appendChild(createFieldLabel('Hold Action'));
  const holdSelect = createActionSelect(pendingHold, (val) => { pendingHold = val; });
  _listContainer.appendChild(holdSelect);

  // Delay slider
  _listContainer.appendChild(createFieldLabel(`Delay: ${pendingDelay}ms`));
  const delayLabel = _listContainer.lastChild;
  const delayInput = document.createElement('input');
  delayInput.type = 'range';
  delayInput.min = 1;
  delayInput.max = 999;
  delayInput.value = pendingDelay;
  delayInput.className = 'effect-slider';
  delayInput.addEventListener('input', () => {
    pendingDelay = parseInt(delayInput.value, 10);
    delayLabel.textContent = `Delay: ${pendingDelay}ms`;
  });
  _listContainer.appendChild(delayInput);

  // Save / Cancel
  const btnRow = document.createElement('div');
  btnRow.className = 'macro-btn-row';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = th ? 'Update' : 'Save';
  saveBtn.className = 'macro-save-btn';
  saveBtn.addEventListener('click', () => {
    if (!pendingPosition || !pendingTap || !pendingHold) return;
    const profile = state.profiles[state.activeProfile];
    if (!profile) return;

    const isFn = state.activeLayer === 'fn';
    const tahData = {
      position: pendingPosition,
      tapAction: pendingTap,
      holdAction: pendingHold,
      delayMs: pendingDelay,
      isFn,
      disabled: th?.disabled || false,
      lineIndex: th?.lineIndex,
    };

    if (th) {
      const idx = profile.tapAndHolds.indexOf(th);
      if (idx >= 0) profile.tapAndHolds[idx] = tahData;
    } else {
      profile.tapAndHolds.push(tahData);
    }

    markDirty();
    renderMacroPanel();
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => renderMacroPanel());

  btnRow.appendChild(saveBtn);
  btnRow.appendChild(cancelBtn);
  _listContainer.appendChild(btnRow);
}

function deleteTapHold(th) {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const idx = profile.tapAndHolds.indexOf(th);
  if (idx >= 0) {
    profile.tapAndHolds.splice(idx, 1);
    markDirty();
    renderMacroPanel();
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createFieldLabel(text) {
  const lbl = document.createElement('label');
  lbl.className = 'effect-label';
  lbl.textContent = text;
  return lbl;
}

function createKeySelect(currentValue, onChange, allowEmpty = false) {
  const select = document.createElement('select');
  select.className = 'effect-select';

  if (allowEmpty) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '— None —';
    select.appendChild(opt);
  }

  // Group by key position categories
  for (const kp of KEY_POSITIONS) {
    const opt = document.createElement('option');
    opt.value = kp.token;
    opt.textContent = `${kp.label} [${kp.token}]`;
    if (kp.token === currentValue) opt.selected = true;
    select.appendChild(opt);
  }

  select.addEventListener('change', () => onChange(select.value || null));
  return select;
}

function createActionSelect(currentValue, onChange) {
  const select = document.createElement('select');
  select.className = 'effect-select';

  for (const cat of ACTION_CATEGORIES) {
    const group = document.createElement('optgroup');
    group.label = cat;
    for (const action of getActionsByCategory(cat)) {
      const opt = document.createElement('option');
      opt.value = action.token;
      opt.textContent = `${action.label} [${action.token}]`;
      if (action.token === currentValue) opt.selected = true;
      group.appendChild(opt);
    }
    select.appendChild(group);
  }

  select.addEventListener('change', () => onChange(select.value));
  return select;
}

function getKeyLabel(token) {
  if (!token) return '—';
  // Check special modifier tokens used in macros
  if (token.startsWith('-') || token.startsWith('+')) {
    const prefix = token[0] === '-' ? 'Press ' : 'Release ';
    const keyToken = token.slice(1);
    const action = ACTION_TOKENS.get(keyToken);
    return prefix + (action ? action.label : keyToken);
  }
  // Check delay tokens
  if (/^d\d+$/.test(token)) return `Delay ${token.slice(1)}ms`;
  if (token === 'dran') return 'Random Delay';

  // Look up in key positions first, then actions
  const kp = getKeyByToken(token);
  if (kp) return kp.label;
  const action = ACTION_TOKENS.get(token);
  if (action) return action.label;
  return token;
}
