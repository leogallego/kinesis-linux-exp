# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based static web application for configuring the Kinesis Freestyle Edge RGB keyboard (KB975). The app reads and writes V-Drive configuration files (key layouts, macros, RGB lighting) entirely in the browser — no backend, no install, deployable on GitHub Pages.

## Target Keyboard

Kinesis Freestyle Edge RGB (KB975-BLU, KB975-RED, KB975-BRN, KB975-SIL). No other Kinesis products are in scope.

## Core Architecture: V-Drive

The keyboard exposes a 4MB USB mass storage device (the "V-Drive") containing plain text configuration files. This is the **only** interface for programming the keyboard — there is no HID control endpoint.

```
FS EDGE RGB (V-Drive)/
├── layouts/          ← Key remaps and macros
│   ├── layout1.txt   ← Profile 1 (up to layout9.txt)
│   └── ...
├── lighting/         ← RGB LED effects
│   ├── led1.txt      ← Profile 1 lighting (up to led9.txt)
│   └── ...
└── settings/
    └── kbd_settings.txt  ← Global keyboard settings
```

**File I/O in browser**: Uses File System Access API (`showDirectoryPicker()`) on Chrome/Edge for direct read/write to a local directory or mounted V-Drive. Falls back to file upload/download on Firefox.

**Mount/Eject**: User manages the V-Drive mount/eject cycle manually.

## V-Drive File Formats

### Layout files (`layouts/layoutN.txt`)

- Remaps: `[position]>[action]` — e.g., `[esc]>[caps]`
- Macros: `{trigger}{co-trigger}>{actions}` — e.g., `{pause}>{-lshft}{h}{+lshft}{e}{l}{l}{o}`
- FN layer: prefix with `fn ` — e.g., `fn [lwin]>[rshft]`
- Tokens are case-insensitive
- Lines starting with `*` are disabled

### LED files (`lighting/ledN.txt`)

- Keyboard effects: `[effect]>[param1][param2][param3]`
- Effects: `[mono]`, `[breathe]`, `[wave]`, `[spectrum]`, `[reactive]`, `[star]`, `[rebound]`, `[loop]`, `[pulse]`, `[rain]`, `[fireball]`, `[ripple]`, `[black]`
- Color: `[RRR][GGG][BBB]` (0-255 per channel)
- Speed: `[spdN]` (1-9)
- Direction: `[dirup]`, `[dirdown]`, `[dirleft]`, `[dirright]`
- Per-key coloring (Freestyle/Breathe): `[key_position]>[RRR][GGG][BBB]`

### Settings (`settings/kbd_settings.txt`)

Fields: `profile_sync_mode`, `startup_file`, `Led_mode`, `macro_speed`, `game_mode`, `nkro_mode`, `status_play_speed`, `program_key_lock`, `v-drive`

## Technology Stack

- **Language**: Vanilla JavaScript (ES2022+, no framework)
- **Markup/Style**: HTML5 + CSS3
- **Deployment**: Static site (GitHub Pages)
- **Build step**: None (no bundler, no npm)
- **Keyboard visualization**: SVG traced from position token map
- **Color picker**: Native HTML5 `<input type="color">`

## Reference Material

These files are packed reference sources for analysis — NOT source code to compile:

- `repomix-reduced.xml` — upstream SmartSet Pascal source (original Kinesis GUI app)
- `repomix-monkeypaint.xml` — Monkeypaint Python library (RGB lighting reference)
- `repomix-example-layouts-mac.xml` — example V-Drive file structure with real configs
- `Freestyle-Edge-Direct-Programming-Guide-*.pdf` — official Kinesis programming syntax
- `Edge-RGB-Manual-*.pdf` — hardware manual
- `kinesis-freestyle-rgb-position-picture.png` — position token map (for SVG tracing)
- `kinesis-freestyle-rgb-keymap-picture.png` — keyboard photo reference

## Constitution

Project governance principles are defined in `.specify/memory/constitution.md` (v2.0.0). Core principles:

1. **V-Drive Architecture** — all config via V-Drive-compatible files; user manages mount/eject
2. **Single Keyboard Target** — Freestyle Edge RGB only; no multi-keyboard abstractions
3. **Reference-Driven Development** — consult reference sources for file format compatibility

## Development Workflow

- All work in feature branches off `main`; no direct commits to `main`
- Validate against physical keyboard or simulated V-Drive directory
- Each commit represents a single logical change

## Active Technologies
- Vanilla JavaScript (ES2022+) + None (no framework, no npm) (001-edge-rgb-configurator)
- Browser File System Access API + upload/download fallback (001-edge-rgb-configurator)
- Vanilla JavaScript (ES2022+) + None (no framework, no bundler) (003-sidebar-tabbar-redesign)
- N/A (UI-only change) (003-sidebar-tabbar-redesign)
- N/A (documentation feature; project uses vanilla JavaScript ES2022+) + None (no build tools, no npm) (004-project-documentation)

## Recent Changes
- 001-edge-rgb-configurator: Added Vanilla JavaScript (ES2022+) + None (no framework, no npm)
