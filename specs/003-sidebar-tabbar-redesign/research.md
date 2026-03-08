# Research: Sidebar Tab Bar Redesign

**Date**: 2026-03-07

## R1: Current Sidebar Flex Layout Chain

**Decision**: Audit and fix the existing CSS flex chain to guarantee viewport containment.

**Findings**: The current layout chain is:
- `body` → `flex-direction: column; height: 100%`
- `.toolbar` → `flex-shrink: 0` (fixed header)
- `.profile-tabs` → `flex-shrink: 0` (fixed profile bar)
- `.workspace` → `flex: 1; min-height: 0` (main area)
- `.side-panel` → `flex-direction: column; flex-shrink: 0; min-height: 0` (sidebar)
- `.panel-nav` → `flex-shrink: 0` (tab bar)
- `.panel-content` → `flex: 1; min-height: 0; overflow-y: auto` (scrollable content)

**Rationale**: The chain is already mostly correct. The key fix is ensuring `.side-panel` does not have a fixed height and properly participates in the flex layout. Adding `overflow: hidden` on `.side-panel` as a safety measure prevents any content from leaking out.

## R2: Collapsible Section Pattern

**Decision**: Reuse the existing chevron toggle pattern from `key-item.js`.

**Pattern**:
- Section header: `<div class="action-group__header">` with chevron `▼` and title
- Content container: `<div class="action-group__items">` with `.collapsed` class toggling `display: none`
- State tracking: `Set` object tracks collapsed category names, persists across re-renders

**Rationale**: This pattern is already proven in the Keys tab. Applying the same CSS classes and behavior to the Macros panel ensures visual consistency and minimal code.

## R3: Tab Bar Visual Enhancement

**Decision**: Strengthen the active tab indicator with a bottom accent border and more distinct color contrast.

**Alternatives considered**:
- Pill-style tabs: More visually distinct but doesn't match the existing flat design
- Underline-only tabs: Clean but may not provide enough contrast in the dark theme

**Rationale**: A bottom border accent on the active tab is the most common pattern, works well with the dark theme, and requires minimal CSS changes.
