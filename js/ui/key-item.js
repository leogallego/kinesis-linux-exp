/**
 * Action picker panel — shows action tokens grouped by category
 * with collapsible sections.
 */

import { ACTION_TOKENS, ACTION_CATEGORIES, getActionsByCategory } from '../data/actions.js';
import { state, markDirty } from '../app.js';
import { onKeySelected, setKeyRemapped, setKeyTooltip } from './keyboard-view.js';

let _listEl = null;
let _searchEl = null;

/** Track collapsed state per category (persists across tab switches) */
const _collapsed = new Set();

export function initActionPicker() {
  _listEl = document.getElementById('action-list');
  _searchEl = document.getElementById('action-search');

  // Build the grouped action list
  renderActionList('');

  // Filter on search input
  _searchEl.addEventListener('input', () => {
    renderActionList(_searchEl.value.toLowerCase().trim());
  });

  // Show panel when a key is selected
  onKeySelected((token) => {
    document.getElementById('panel-action').hidden = false;
    highlightCurrentAction(token);
  });
}

function renderActionList(filter) {
  _listEl.innerHTML = '';
  const isFiltering = filter.length > 0;

  for (const category of ACTION_CATEGORIES) {
    const actions = getActionsByCategory(category);
    const filtered = isFiltering
      ? actions.filter(a => a.token.includes(filter) || a.label.toLowerCase().includes(filter))
      : actions;

    if (filtered.length === 0) continue;

    const groupEl = document.createElement('div');
    groupEl.className = 'action-group';

    // When filtering, always expand; otherwise respect saved state
    const isCollapsed = !isFiltering && _collapsed.has(category);

    // Header (clickable to toggle)
    const headerEl = document.createElement('div');
    headerEl.className = 'action-group__header';

    const chevronEl = document.createElement('span');
    chevronEl.className = 'action-group__chevron' + (isCollapsed ? ' collapsed' : '');
    chevronEl.textContent = '\u25BC'; // ▼

    const titleEl = document.createElement('span');
    titleEl.className = 'action-group__title';
    titleEl.textContent = category;

    const countEl = document.createElement('span');
    countEl.className = 'action-group__count';
    countEl.textContent = `(${filtered.length})`;

    headerEl.appendChild(chevronEl);
    headerEl.appendChild(titleEl);
    headerEl.appendChild(countEl);

    // Items container
    const itemsEl = document.createElement('div');
    itemsEl.className = 'action-group__items' + (isCollapsed ? ' collapsed' : '');

    for (const action of filtered) {
      const itemEl = document.createElement('div');
      itemEl.className = 'action-item';
      itemEl.textContent = `${action.label} [${action.token}]`;
      itemEl.dataset.token = action.token;

      itemEl.addEventListener('click', () => {
        assignAction(action.token);
      });

      itemsEl.appendChild(itemEl);
    }

    // Toggle collapse on header click (only when not filtering)
    headerEl.addEventListener('click', () => {
      if (isFiltering) return;
      const nowCollapsed = _collapsed.has(category);
      if (nowCollapsed) {
        _collapsed.delete(category);
      } else {
        _collapsed.add(category);
      }
      chevronEl.classList.toggle('collapsed', !nowCollapsed);
      itemsEl.classList.toggle('collapsed', !nowCollapsed);
    });

    groupEl.appendChild(headerEl);
    groupEl.appendChild(itemsEl);
    _listEl.appendChild(groupEl);
  }
}

function assignAction(actionToken) {
  const keyToken = state.selectedKey;
  if (!keyToken) return;

  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const isFn = state.activeLayer === 'fn';

  // Find existing remap for this key+layer, or create new one
  const existing = profile.remaps.find(
    r => r.position === keyToken && r.isFn === isFn
  );

  if (existing) {
    existing.action = actionToken;
  } else {
    profile.remaps.push({
      position: keyToken,
      action: actionToken,
      isFn,
      disabled: false,
      lineIndex: undefined,
    });
  }

  markDirty();
  setKeyRemapped(keyToken, true);
  setKeyTooltip(keyToken, `→ ${actionToken}`);
  highlightCurrentAction(keyToken);
}

function highlightCurrentAction(keyToken) {
  // Remove previous highlight
  for (const el of _listEl.querySelectorAll('.action-item.current')) {
    el.classList.remove('current');
  }

  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const isFn = state.activeLayer === 'fn';
  const remap = profile.remaps.find(
    r => r.position === keyToken && r.isFn === isFn && !r.disabled
  );

  if (remap) {
    const el = _listEl.querySelector(`.action-item[data-token="${remap.action}"]`);
    if (el) {
      el.classList.add('current');
      el.scrollIntoView({ block: 'nearest' });
    }
  }
}

/**
 * Update all key remap indicators on the keyboard view.
 * Called from app.js refreshUI.
 */
export function refreshRemapIndicators() {
  const profile = state.profiles[state.activeProfile];
  if (!profile) return;

  const isFn = state.activeLayer === 'fn';

  for (const remap of profile.remaps) {
    if (remap.isFn === isFn && !remap.disabled) {
      setKeyRemapped(remap.position, true);
      setKeyTooltip(remap.position, `→ ${remap.action}`);
    }
  }
}
