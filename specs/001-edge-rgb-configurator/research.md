# Research: Edge RGB Configurator

**Branch**: `001-edge-rgb-configurator` | **Date**: 2026-03-07

## R1: UI Technology

**Decision**: Vanilla HTML + CSS + JavaScript static site

**Rationale**:
- Keyboard configurators are well-suited to web UIs (precedent: Vial-web,
  QMK Configurator, Via). SVG keyboard layouts are trivial to build and
  style compared to native GUI toolkits.
- Zero install for users — open a URL in any browser.
- Deployable on GitHub Pages — free hosting, no backend.
- HTML5 `<input type="color">` provides a complete RGB picker for free.
- CSS handles keyboard key hover/selection/coloring states naturally.
- No framework needed — the app is a single page with ~95 interactive
  SVG elements, a few panels, and file I/O. Vanilla JS is sufficient.
- No build step — no npm, no bundler, no transpilation.

**Alternatives considered**:
- **PySide6 (Qt 6)**: QGraphicsScene is powerful but ~200MB dependency,
  requires pip install, Linux-only. Overkill for this use case.
- **GTK 4 (PyGObject)**: Best GNOME integration but requires manual
  hit-testing, Linux-only, complex install.
- **Flask + JS**: Adds a Python backend that isn't needed — all logic
  can run client-side.
- **React/Vue/Svelte**: Adds a build step (npm, bundler) for marginal
  benefit. The app is simple enough for vanilla JS.

## R2: Browser File I/O

**Decision**: File System Access API with upload/download fallback.

**Rationale**:
- **File System Access API** (`showDirectoryPicker()`) allows direct
  read/write to a local directory. Available in Chrome, Edge, Brave.
  The user can point it at a mounted V-Drive path or a local staging
  directory. Closest to a native app experience.
- **Upload/download fallback** for Firefox (which does not support
  File System Access API): user uploads files via `<input type="file">`,
  edits in the browser, downloads modified files.
- Both approaches work on GitHub Pages — no backend needed.
- The app detects API availability and uses the best option.

**Implementation notes**:
- `showDirectoryPicker()` returns a `FileSystemDirectoryHandle`
- Read: `handle.getFileHandle()` → `file.text()`
- Write: `handle.getFileHandle({create: true})` → `writable.write()`
- Fallback: `<input type="file" webkitdirectory>` for reading,
  `URL.createObjectURL()` + `<a download>` for writing

## R3: Keyboard Visualization

**Decision**: SVG traced from the position token map image.

**Rationale**:
- The `kinesis-freestyle-rgb-position-picture.png` (from the Direct
  Programming Guide section 4.5) shows exact key positions and tokens.
- Tracing this into an SVG gives pixel-accurate key placement.
- Each key becomes an SVG `<rect>` or `<path>` element with:
  - `data-token` attribute (e.g., `data-token="esc"`)
  - CSS classes for state (`.selected`, `.remapped`, `.colored`)
  - Click handler for key selection
- CSS handles hover effects, selection highlight, and per-key RGB
  coloring (via `fill` or `background-color`).
- The split keyboard layout (left + right halves) maps naturally to
  two SVG groups.

**Reference**: Vial-web uses a similar SVG-based keyboard rendering
approach for QMK keyboards.

## R4: Monkeypaint Reference Analysis

**Decision**: Use Monkeypaint's data patterns as reference for key
order and color format. Build parsers from scratch in JavaScript.

**Key patterns to adopt**:
- `KEY_ORDER` list (105 keys in canonical output order for LED files)
- Key alias groupings (alpha, meta, arrows, etc.)
- CRLF line endings (`\r\n`) for V-Drive files
- `[key]>[R][G][B]` format for per-key colors
- `Color` as a simple object with `{red, green, blue}` integer fields

**What we must implement beyond Monkeypaint**:
- Bidirectional file parsing (Monkeypaint is write-only)
- Layout file parsing (remaps, macros, tap-and-hold)
- All 14 lighting effect configurations
- FN layer support
- Global keyboard settings

## R5: File Format Specifications

**Source**: Freestyle Edge Direct Programming Guide

### Layout files
- Remaps: `[position]>[action]` (square brackets)
- Macros: `{trigger}{co-trigger}>{action1}{action2}...` (curly braces)
- FN layer prefix: `fn ` before the position token
- Tap-and-Hold: `[position]>[tap_action][t&hNNN][hold_action]`
- Disabled lines: prefix with `*`
- Case-insensitive tokens, one entry per line

### LED files
- Effect line: `[effect]>[param1][param2][param3]`
- Per-key color: `[key]>[RRR][GGG][BBB]`
- FN layer: `fn [key]>[RRR][GGG][BBB]`
- Color values: 0-255, speed: `[spd1]`-`[spd9]`
- Direction: `[dirup]`, `[dirdown]`, `[dirleft]`, `[dirright]`

### Settings file (`kbd_settings.txt`)
- Key-value pairs, one per line
- Fields: `profile_sync_mode`, `startup_file`, `Led_mode`,
  `macro_speed`, `game_mode`, `nkro_mode`, `status_play_speed`,
  `program_key_lock`, `v-drive`

## R6: Key and Action Token Inventories

**Source**: Direct Programming Guide sections 4.4, 4.5, 4.8, 4.9

### Position tokens (95 physical keys)
```
hk0, esc, f1-f12, prnt, pause, del,
hk1, hk2, tilde, 1-0, hyph, =, bspc, home,
hk3, hk4, tab, q-t, y-p, obrk, cbrk, \, end,
hk5, hk6, caps, a-g, h-l, colon, apos, ent, pup,
hk7, hk8, lshft, z-b, n-m, com, per, /, rshft, up, pdn,
hk9, hk10, lctrl, lwin, lalt, lspc, rspc, ralt, rctrl, lft, dwn, rght
```

### FN-layer unique tokens (8 keys)
```
fn [f1]=mute, fn [f2]=vol+, fn [f3]=vol-,
fn [f4]=play, fn [f5]=prev, fn [f6]=next,
fn [pause]=ins, fn [del]=scrlk
```

### Action token categories (~130 tokens)
Letters (a-z), Numbers (0-9), Function keys (f1-f24),
Modifiers, Punctuation, Navigation, Editing, Media,
Mouse buttons, Keypad, Lock keys, Special, International
