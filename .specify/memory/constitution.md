<!--
  Sync Impact Report
  ==================
  Version change: 1.1.1 -> 2.0.0
  Modified principles:
    - I. V-Drive Architecture: removed mandatory auto-eject; user
      manages mount/eject manually for MVP
  Added sections: none
  Removed sections: none
  Other changes:
    - Technology Constraints: Python 3.11+ replaced with vanilla
      JavaScript (static site). PEP 8 replaced with standard JS
      conventions. GUI resolved to browser-based static site
      (deployable on GitHub Pages). Platform broadened from
      Linux-only to any OS with a modern browser.
  Rationale for MAJOR bump: backward-incompatible redefinition of
    language constraint (Python -> JavaScript) and V-Drive lifecycle
    (auto-eject removed).
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no updates needed
    - .specify/templates/spec-template.md ✅ no updates needed
    - .specify/templates/tasks-template.md ✅ no updates needed
    - .specify/templates/commands/*.md — no files exist
  Follow-up TODOs: none
-->

# Kinesis Freestyle Edge RGB Configurator Constitution

## Core Principles

### I. V-Drive Architecture

All keyboard configuration MUST be performed by reading and writing
files compatible with the keyboard's virtual USB drive (V-Drive).
Layout files live in `layouts/` (e.g., `layout1.txt` through
`layout9.txt`) and LED configuration files live in `lighting/`
(e.g., `led1.txt` through `led9.txt`). The application MUST NOT
use direct USB/HID commands. The V-Drive file format is the sole
interface between the application and the keyboard hardware.

For this MVP, the user manages the V-Drive mount/eject cycle
manually. The app reads and writes files via the browser (using
the File System Access API where available, or upload/download
as fallback).

### II. Single Keyboard Target

This project targets exclusively the Kinesis Freestyle Edge RGB
keyboard. All design decisions, file format parsing, key maps, and
LED effect definitions MUST be specific to this keyboard model.
There is no requirement to support other Kinesis products, and
abstractions for multi-keyboard support MUST NOT be introduced
unless explicitly requested.

### III. Reference-Driven Development

The upstream SmartSet Pascal codebase (`repomix-reduced.xml`), the
Monkeypaint Python library (`repomix-monkeypaint.xml`), the example
V-Drive layout files (`repomix-example-layouts-mac.xml`), and the
Freestyle Edge Direct Programming Guide (PDF in repo root) serve as
authoritative references for file formats, key codes, and LED
protocols. When implementing a feature, the relevant reference
MUST be consulted to ensure compatibility with the keyboard's
expected file formats.

## Technology Constraints

- **Language**: Vanilla JavaScript (ES2022+, no framework)
- **Markup/Style**: HTML5 + CSS3
- **Deployment**: Static site (GitHub Pages compatible)
- **Build step**: None required (no bundler, no npm)
- **Platform**: Any modern browser (Chrome, Firefox, Edge)
- **Reference material**:
  - `repomix-reduced.xml` — upstream SmartSet Pascal source
  - `repomix-monkeypaint.xml` — Python RGB lighting reference
  - `repomix-example-layouts-mac.xml` — V-Drive file structure
  - Freestyle Edge Direct Programming Guide (PDF in repo root)
  - Other hardware manuals (PDF files in repo root)
  - `kinesis-freestyle-rgb-position-picture.png` — position token map
  - `kinesis-freestyle-rgb-keymap-picture.png` — keyboard photo

## Development Workflow

- **Branching**: All work MUST be done in feature branches off
  `main`; direct commits to `main` are not permitted
- **Testing**: Validate against a physical Freestyle Edge RGB
  keyboard or simulated V-Drive directory structure
- **Commits**: Each commit MUST represent a single logical change

## Governance

- This constitution supersedes ad-hoc decisions. All PRs and
  reviews MUST verify compliance with the three core principles.
- **Amendments**: Any principle change requires documentation of
  the rationale, the old rule, and the new rule.
- **Versioning**: This constitution follows semantic versioning:
  - MAJOR: Principle removal or backward-incompatible redefinition
  - MINOR: New principle or materially expanded guidance
  - PATCH: Clarifications, wording, or typo fixes
- **Compliance review**: At each feature milestone, verify that
  the change set adheres to all three principles.

**Version**: 2.0.0 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-07
