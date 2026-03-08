# Implementation Plan: Edge RGB Configurator

**Branch**: `001-edge-rgb-configurator` | **Date**: 2026-03-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-edge-rgb-configurator/spec.md`

## Summary

Build a static web application (HTML + CSS + vanilla JavaScript) for
configuring key layouts and RGB lighting on the Kinesis Freestyle Edge
RGB keyboard. The app runs entirely in the browser with zero backend.
It reads and writes V-Drive-compatible configuration files using the
File System Access API (Chrome/Edge) with upload/download fallback
(Firefox). Deployable on GitHub Pages.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2022+)
**Primary Dependencies**: None (no framework, no npm)
**Storage**: Browser File System Access API + upload/download fallback
**Testing**: Browser-based manual testing; optional Playwright for E2E
**Target Platform**: Any modern browser (Chrome, Firefox, Edge)
**Project Type**: Static web application
**Performance Goals**: Instant UI response, file parse/generate < 50ms
**Constraints**: Zero backend, zero install, offline-capable, no build step
**Scale/Scope**: 95 keys, 9 profiles, 14 lighting effects, ~130 action tokens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. V-Drive Architecture | PASS | App generates V-Drive-compatible files. No USB/HID. User manages mount/eject manually. File formats match the Direct Programming Guide exactly. |
| II. Single Keyboard Target | PASS | Freestyle Edge RGB only. SVG keyboard traced from the position token map image. No multi-keyboard abstractions. |
| III. Reference-Driven Development | PASS | File formats from Direct Programming Guide. Key tokens from Position Token Map. Monkeypaint analyzed for data patterns. Keyboard images used for SVG layout. |
| Vanilla JS (no framework) | PASS | Constitution specifies vanilla JavaScript ES2022+. |
| Static site (GitHub Pages) | PASS | No backend, no build step. |
| Feature branches | PASS | Working on `001-edge-rgb-configurator` branch. |

**Post-Phase 1 re-check**: All principles satisfied. Data model uses
V-Drive file formats directly (plain objects, no ORM). No multi-keyboard
abstractions. File format contracts reference the Direct Programming
Guide. Technology stack is vanilla JS per constitution v2.0.0.

## Project Structure

### Documentation (this feature)

```text
specs/001-edge-rgb-configurator/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── file-formats.md  # V-Drive file format contracts
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
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

**Structure Decision**: Single static site with vanilla JS modules.
No build step, no bundling. Files organized by responsibility:
`parsers/` for file I/O logic, `data/` for static definitions,
`ui/` for DOM interaction, `io/` for browser file system access.
ES modules (`import`/`export`) used for code organization.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
