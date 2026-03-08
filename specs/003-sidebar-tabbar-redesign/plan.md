# Implementation Plan: Sidebar Tab Bar Redesign

**Branch**: `003-sidebar-tabbar-redesign` | **Date**: 2026-03-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-sidebar-tabbar-redesign/spec.md`

## Summary

Redesign the sidebar panel navigation: ensure tabs (Keys, Lighting, Macros, Settings) are prominently positioned at the top of the sidebar, the sidebar content scrolls internally without causing page-level scrolling, and collapsible sections are applied consistently — particularly in the Macros panel (the Keys tab already has this behavior).

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2022+)
**Primary Dependencies**: None (no framework, no bundler)
**Storage**: N/A (UI-only change)
**Testing**: Manual browser testing + Playwright for automated verification
**Target Platform**: Modern browsers (Chrome, Firefox, Edge)
**Project Type**: Static web application
**Performance Goals**: Instant tab switching, smooth scroll
**Constraints**: No build step, no npm, static deployment on GitHub Pages
**Scale/Scope**: 4 sidebar panels, ~130 action tokens in Keys tab, 14 lighting effects

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. V-Drive Architecture | N/A | No file I/O changes |
| II. Single Keyboard Target | PASS | UI-only, no keyboard model changes |
| III. Reference-Driven Development | N/A | No file format changes |
| Technology Constraints | PASS | Vanilla JS + CSS only, no framework |
| Development Workflow | PASS | Feature branch, incremental commits |

All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-sidebar-tabbar-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output (minimal — UI-only change)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (files to modify)

```text
# CSS changes
css/style.css                    # Sidebar layout, tab bar, collapsible styles

# JS UI module changes
js/ui/macro-editor.js            # Add collapsible section headers
js/app.js                        # Verify panel tab switching logic (already works)

# HTML structure
index.html                       # Verify sidebar/panel-nav structure (already correct)

# No changes needed:
# js/ui/key-item.js              # Already has collapsible categories
# js/ui/effect-selector.js       # Content is compact, no collapse needed
# js/ui/color-picker.js          # Content is compact, no collapse needed
# js/ui/settings-panel.js        # Content is compact, no collapse needed
# js/parsers/*                   # No parser changes
# js/data/*                      # No data changes
# js/io/*                        # No I/O changes
```

**Structure Decision**: This is a CSS-focused change with minor JS modifications. The existing HTML structure already has `<nav class="panel-nav">` at the top of `<aside class="side-panel">` with the correct tab buttons. The primary work is CSS refinement to ensure proper flex layout containment and adding collapsible behavior to the Macros panel.

## Key Findings from Existing Code

### What Already Works

1. **Panel tabs at top**: The `<nav class="panel-nav">` is already the first child of `<aside class="side-panel">`. Tabs are positioned at the top.
2. **Keys tab collapsible**: `js/ui/key-item.js` already implements collapsible categories with chevron toggles, collapsed state persistence across tab switches, and auto-expand on search filter.
3. **Internal scrolling**: `.panel-content` has `overflow-y: auto` and `min-height: 0` for flex-based scroll containment.
4. **Page scroll prevention**: `html, body { height: 100%; overflow: hidden }` is already set.

### What Needs Improvement

1. **Tab bar visual prominence**: Current `.panel-nav__btn` styling is minimal — needs stronger active state differentiation and potentially a bottom border indicator.
2. **Tab bar pinning**: The `.panel-nav` should use `flex-shrink: 0` to never collapse (already set via flex column on `.side-panel`). Verify the flex chain is unbroken from `body` → `.workspace` → `.side-panel` → `.panel-content`.
3. **Macros panel collapsible sections**: The Macros tab renders "Macros" and "Tap & Hold" as plain `<h3>` headers. These need the same collapsible chevron pattern used in the Keys tab.
4. **CSS flex chain audit**: Ensure every container in the chain from `body` to `.panel-content` has proper `min-height: 0` and flex properties to prevent overflow from bubbling up to page scroll.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
