# Quickstart: Edge RGB Configurator

**Branch**: `001-edge-rgb-configurator` | **Date**: 2026-03-07

## Prerequisites

- Any modern browser (Chrome, Edge, or Brave recommended for full
  File System Access API support; Firefox works with upload/download)
- Kinesis Freestyle Edge RGB keyboard (firmware 1.0.121+)

## Run Locally

```bash
# No install needed — just serve the static files
# Option 1: Python's built-in server
python3 -m http.server 8000

# Option 2: Node's npx serve
npx serve .

# Option 3: PHP built-in server
php -S localhost:8000
```

Open `http://localhost:8000` in your browser.

## Deploy to GitHub Pages

Push the repository to GitHub and enable Pages in Settings → Pages →
Source: Deploy from branch → `main` → `/ (root)`. The app is served
at `https://<username>.github.io/<repo>/`.

## Workflow: Apply Changes to Keyboard

1. Open the app in your browser.
2. Click **Open Directory** (Chrome/Edge) or use the upload controls
   to load existing V-Drive files.
3. Make changes (remap keys, configure lighting, etc.).
4. Save — the app writes files to the working directory (or triggers
   downloads in Firefox).
5. Connect the keyboard and open the V-Drive (SmartSet + F8).
6. Copy the changed files from the working directory to the V-Drive:
   ```bash
   cp -r ~/edge-rgb-config/layouts/* /media/$USER/FS\ EDGE\ RGB/layouts/
   cp -r ~/edge-rgb-config/lighting/* /media/$USER/FS\ EDGE\ RGB/lighting/
   ```
7. Eject the V-Drive safely:
   ```bash
   udisksctl unmount -b /dev/sdX1
   ```
8. Close the V-Drive on the keyboard (SmartSet + F8).
9. The keyboard applies the new configuration.

## Workflow: Import from Keyboard

1. Connect the keyboard and open the V-Drive (SmartSet + F8).
2. Copy the V-Drive contents to a local directory:
   ```bash
   cp -r /media/$USER/FS\ EDGE\ RGB/* ~/edge-rgb-config/
   ```
3. Eject the V-Drive.
4. Open the app and click **Open Directory** → select `~/edge-rgb-config/`.
5. The app loads existing layouts and LED configurations.

## Development

No build step, no npm, no dependencies. Edit the source files and
refresh the browser.

```bash
# Optional: run E2E tests with Playwright
npx playwright test
```

## Project Structure

```
index.html                   # Single-page app entry point
css/
  style.css                  # All styles (keyboard layout, panels, theme)
js/
  app.js                     # App entry point, state management
  parsers/
    layout-parser.js         # Parse and generate layout .txt files
    led-parser.js            # Parse and generate LED .txt files
    settings-parser.js       # Parse and generate kbd_settings.txt
  data/
    keys.js                  # KeyPosition definitions, KEY_ORDER
    actions.js               # ActionToken dictionary (~130 tokens)
    effects.js               # LightingEffect definitions (14 effects)
  ui/
    keyboard-view.js         # SVG keyboard rendering and interaction
    key-item.js              # Individual key element behavior
    color-picker.js          # Color picker integration
    effect-selector.js       # Lighting effect configuration panel
    macro-editor.js          # Macro creation/editing UI
    profile-tabs.js          # Profile selector (1-9)
    settings-panel.js        # Global keyboard settings UI
  io/
    file-access.js           # File System Access API wrapper
    file-fallback.js         # Upload/download fallback for Firefox
assets/
  keyboard-layout.svg        # SVG traced from position token map
  kinesis-freestyle-rgb-position-picture.png
  kinesis-freestyle-rgb-keymap-picture.png
```
