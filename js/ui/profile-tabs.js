/**
 * Profile tab bar — renders 9 profile tabs with dirty indicators.
 * Handles profile switching with unsaved changes confirmation.
 */

import { state, loadProfile, refreshUI, showToast } from '../app.js';

let _container = null;

export function initProfileTabs() {
  _container = document.getElementById('profile-tabs');
  renderTabs();
}

export function refreshProfileTabs() {
  renderTabs();
}

function renderTabs() {
  _container.innerHTML = '';

  for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'profile-tabs__tab';
    btn.textContent = i;

    if (i === state.activeProfile) {
      btn.classList.add('active');
    }

    const profile = state.profiles[i];
    if (profile?.dirty) {
      btn.classList.add('dirty');
    }

    btn.addEventListener('click', () => switchProfile(i));
    _container.appendChild(btn);
  }
}

async function switchProfile(num) {
  if (num === state.activeProfile) return;

  // Warn about unsaved changes
  const current = state.profiles[state.activeProfile];
  if (current?.dirty) {
    const confirmed = confirm(
      `Profile ${state.activeProfile} has unsaved changes. Switch anyway?`
    );
    if (!confirmed) return;
  }

  state.activeProfile = num;

  // Load profile if we have a directory open
  if (state.dirHandle || state.uploadedFiles) {
    await loadProfile(num);
  } else {
    refreshUI();
  }

  renderTabs();
  showToast(`Switched to Profile ${num}`);
}
