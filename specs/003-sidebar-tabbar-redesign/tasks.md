# Tasks: Sidebar Tab Bar Redesign

**Input**: Design documents from `/specs/003-sidebar-tabbar-redesign/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Not explicitly requested in the spec. Tests are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: User Story 1+2 - Tab Bar & Viewport Containment (Priority: P1)

**Goal**: Panel tabs are visually prominent at the top of the sidebar with a strong active indicator. The sidebar is fully viewport-contained with no page-level scrolling.

**Independent Test**: Open the app at 1280x800, verify tabs are at the top with clear active state. Open Keys tab (long content), scroll the action list — tab bar stays pinned, page does not scroll.

### Implementation

- [x] T001 [US1] Update `.panel-nav` and `.panel-nav__btn` styles in `css/style.css`: add bottom accent border on active tab, increase visual contrast between active/inactive states, ensure `flex-shrink: 0` on `.panel-nav`
- [x] T002 [US2] Audit and fix the CSS flex chain in `css/style.css`: verify every container from `body` → `.workspace` → `.side-panel` → `.panel-content` has correct `min-height: 0`, `flex`, and `overflow` properties. Add `overflow: hidden` on `.side-panel` as safety measure. Ensure `.panel-content` has `flex: 1; min-height: 0; overflow-y: auto`

**Checkpoint**: Tab bar is visually prominent, sidebar scrolls internally, page never scrolls vertically

---

## Phase 2: User Story 3 - Collapsible Sections (Priority: P2)

**Goal**: Sidebar panels use collapsible sections to reduce visual clutter. The Macros panel gets collapsible "Macros" and "Tap & Hold" headers. The Keys tab already has this behavior — verify it works correctly.

**Independent Test**: Open Macros tab with both macros and tap-and-hold entries loaded, verify each section has a clickable chevron header that toggles visibility. Open Keys tab, verify existing collapsible categories still work (collapse, expand, auto-expand on search, state persistence).

### Implementation

- [x] T003 [US3] Add collapsible section headers to `js/ui/macro-editor.js`: replace the plain `<h3>` "Macros" and "Tap & Hold" headings with clickable chevron toggle headers using the same CSS classes (`action-group__header`, `action-group__chevron`, `action-group__title`) and collapse pattern from `js/ui/key-item.js`. Track collapsed state in a module-level `Set` that persists across re-renders
- [x] T004 [P] [US3] Add CSS styles for collapsible section headers in `css/style.css` if any new styles are needed beyond the existing `.action-group` classes (verify existing styles apply correctly to the Macros panel context)

**Checkpoint**: Macros panel has collapsible sections, Keys tab collapsible behavior verified working

---

## Phase 3: Polish & Verification

**Purpose**: Cross-cutting verification that all panels work correctly after changes

- [x] T005 [P] Verify all four panel tabs switch correctly in `js/app.js` — Keys, Lighting, Macros, Settings panels show/hide properly with the updated styling
- [x] T006 [P] Verify responsive layout at < 900px breakpoint in `css/style.css` — sidebar stacks below keyboard, collapsible sections work in stacked mode, no horizontal overflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1+US2)**: No dependencies — CSS-only changes, can start immediately
  - T001 and T002 modify the same file (`css/style.css`) but different sections, so they can run sequentially within a single edit session
- **Phase 2 (US3)**: Independent of Phase 1 — different files (`macro-editor.js` vs `style.css`)
  - T003 and T004 can run in parallel (JS vs CSS)
- **Phase 3 (Polish)**: After Phases 1 and 2 — verification tasks

### Parallel Opportunities

- T001 + T003 can run in parallel (different files: `css/style.css` vs `js/ui/macro-editor.js`)
- T005 + T006 can run in parallel (verification tasks, read-only)
- All phases are small enough to complete in a single session

---

## Implementation Strategy

### MVP (User Stories 1+2)

1. Complete T001 + T002 (tab bar + viewport containment)
2. **STOP and VALIDATE**: Verify tabs, scrolling, no page scroll
3. This alone delivers the core improvement

### Full Delivery

1. T001 + T002 → Tab bar + viewport containment
2. T003 + T004 → Collapsible macros sections
3. T005 + T006 → Verify everything works
4. Total: 6 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- The Keys tab collapsible behavior (FR-005/FR-006/FR-007) already works — no changes needed in `key-item.js`
- The Settings and Lighting panels do not need collapsible sections (FR-009/FR-010)
- Commit after each phase checkpoint
