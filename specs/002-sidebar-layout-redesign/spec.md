# Feature Specification: Sidebar Layout Redesign

**Feature Branch**: `002-sidebar-layout-redesign`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Improve the design. Move the sidebar tabs (keys/lighting/macros/settings) to the top. Make sure the sidebar doesn't require scrolling the page. Add collapsible sections to the different menus in the sidebar, particularly for the keys tab (letter/number/function, etc.)."

## User Scenarios & Testing

### User Story 1 - Sidebar Tabs at Top and Non-Scrolling Layout (Priority: P1)

As a user configuring my keyboard, I want the sidebar panel tabs (Keys, Lighting, Macros, Settings) positioned at the top of the sidebar and the entire layout to fit within the viewport so I can switch between panels and interact with sidebar content without scrolling the page.

**Why this priority**: The tabs are currently at the bottom of the sidebar, requiring users to scroll past all content to switch panels. The sidebar also causes page-level scrolling, making the app feel broken. Fixing both together delivers a usable baseline layout.

**Independent Test**: Can be verified by loading the app at 1280x720 and confirming that all four panel tabs are visible at the top of the sidebar, the keyboard view is visible, and no page-level vertical scrolling is required.

**Acceptance Scenarios**:

1. **Given** the app is loaded at 1280x720 or larger, **When** the user views the sidebar, **Then** the panel tabs (Keys, Lighting, Macros, Settings) are visible at the top of the sidebar without scrolling.
2. **Given** any panel tab is active, **When** the user clicks a different tab, **Then** the tab switches and the tabs remain fixed at the top of the sidebar.
3. **Given** the sidebar content exceeds the available vertical space, **When** the user scrolls within the sidebar, **Then** only the sidebar content scrolls internally and the page does not scroll vertically.
4. **Given** the app is loaded at 1920x1080, **When** the user interacts with any part of the interface, **Then** the keyboard view and sidebar are both fully visible without page scrolling.

---

### User Story 2 - Collapsible Action Categories (Priority: P2)

As a user browsing the action list in the Keys panel, I want the action categories (letter, number, function, modifier, punctuation, navigation, editing, media, mouse, keypad, lock, special, international) to be collapsible so I can quickly navigate to the category I need without scrolling through all entries.

**Why this priority**: The Keys panel lists ~130 action tokens across 13 categories. Collapsible sections dramatically reduce scrolling and help users find actions faster. This builds on the non-scrolling sidebar from US1.

**Independent Test**: Can be verified by loading the app, selecting a key, and clicking category headers to expand/collapse them.

**Acceptance Scenarios**:

1. **Given** the Keys panel is active, **When** the user views the action list, **Then** each category has a visible expand/collapse indicator (e.g., chevron or triangle).
2. **Given** a category is expanded, **When** the user clicks the category header, **Then** the category collapses and hides its action items.
3. **Given** a category is collapsed, **When** the user clicks the category header, **Then** the category expands and shows its action items.
4. **Given** the user searches/filters actions, **When** matching results span multiple categories, **Then** only categories with matching results are shown and they are expanded.
5. **Given** the user has collapsed several categories, **When** the user switches to another panel tab and returns to Keys, **Then** the collapse state is preserved for the session.

---

### Edge Cases

- What happens when the viewport is very small (e.g., mobile or narrow window)? The sidebar should still be usable with internal scrolling; the layout may stack vertically.
- What happens when all categories are collapsed? The action list area should show all category headers compactly without empty space filling the rest.
- What happens when a search filter is active and the user collapses a category? The search filter takes precedence — collapsed state is ignored while filtering is active, all matching categories are shown expanded.

## Requirements

### Functional Requirements

- **FR-001**: The panel tabs (Keys, Lighting, Macros, Settings) MUST be positioned at the top of the sidebar, above all panel content.
- **FR-002**: The sidebar MUST fit within the viewport height. The page MUST NOT require vertical scrolling to access any part of the sidebar at viewports 1280x720 or larger.
- **FR-003**: The sidebar content area MUST scroll internally when its content exceeds the available vertical space.
- **FR-004**: Each action category in the Keys panel MUST be collapsible via clicking the category header.
- **FR-005**: Each collapsible category header MUST display a visual indicator showing its current expand/collapse state.
- **FR-006**: When a search filter is active in the Keys panel, all categories with matching results MUST be shown expanded regardless of their collapse state.
- **FR-007**: Category collapse states MUST persist within the current session (not lost when switching tabs).
- **FR-008**: The keyboard view and toolbar MUST remain visible and unaffected by the sidebar layout changes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can switch between all four panel tabs without scrolling the page, at any viewport size 1280x720 or larger.
- **SC-002**: The full sidebar (tabs + content) and keyboard view are visible within the viewport at 1280x720 resolution without page-level vertical scrolling.
- **SC-003**: Users can collapse/expand any action category in the Keys panel with a single click.
- **SC-004**: Filtering actions via the search input correctly shows only matching categories in expanded state.
- **SC-005**: Category collapse/expand state persists when switching between panel tabs within the same session.

## Assumptions

- The sidebar remains on the right side of the layout as currently positioned.
- All categories in the Keys panel start expanded by default on initial page load.
- Collapse state is session-only (not persisted across page reloads).
- This feature only affects the sidebar panel layout and the Keys panel action list; the keyboard SVG area, toolbar, and profile tabs are unchanged.
- The existing panel tab behavior (switching content between Keys/Lighting/Macros/Settings) remains the same; only the tab position changes.
