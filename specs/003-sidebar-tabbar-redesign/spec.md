# Feature Specification: Sidebar Tab Bar Redesign

**Feature Branch**: `003-sidebar-tabbar-redesign`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Improve the design. Move the sidebar tabs (keys/lighting/macros/settings) to the top. Make sure the sidebar doesn't require scrolling the page. Add collapsible menus to the different sections in the sidebar, particularly for the keys tab (letter/number/function, etc.)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sidebar Tabs at Top (Priority: P1)

As a user configuring my keyboard, I want the sidebar panel tabs (Keys, Lighting, Macros, Settings) repositioned to the top of the sidebar as a prominent horizontal tab bar, so I can quickly switch between configuration modes without the tabs getting lost in the sidebar layout.

**Why this priority**: Navigation between configuration panels is the most frequent sidebar interaction. Making these tabs visually prominent and consistently accessible improves the core workflow for all users.

**Independent Test**: Open the app, verify the four panel tabs (Keys, Lighting, Macros, Settings) appear as a clear horizontal tab bar at the very top of the sidebar. Clicking each tab switches the panel content below without any page scrolling.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** I look at the sidebar, **Then** the four panel tabs are rendered as a horizontal tab bar at the top of the sidebar with clear active/inactive states
2. **Given** I am on the Keys tab, **When** I click the Lighting tab, **Then** the panel content switches to show lighting controls and the Lighting tab becomes visually active
3. **Given** the sidebar tabs are at the top, **When** I interact with any panel content below, **Then** the tab bar remains fixed/visible and does not scroll away

---

### User Story 2 - Viewport-Contained Sidebar (Priority: P1)

As a user, I want the sidebar to fit entirely within the browser viewport without causing page-level scrolling, so I can see all controls and the keyboard visualization simultaneously without losing context.

**Why this priority**: Page scrolling disrupts the user experience by hiding either the keyboard or the controls. The sidebar must be self-contained with internal scrolling only.

**Independent Test**: Resize the browser to various heights. The sidebar content area scrolls internally while the keyboard area and toolbar remain visible. The page itself never scrolls vertically.

**Acceptance Scenarios**:

1. **Given** the app is loaded in a standard desktop viewport (1280x800), **When** a panel has more content than fits, **Then** only the panel content area scrolls internally — the page, toolbar, profile tabs, and keyboard area remain fixed
2. **Given** the sidebar has a long list of actions in the Keys tab, **When** I scroll the action list, **Then** the panel tab bar at the top of the sidebar stays pinned and does not scroll away
3. **Given** I resize the browser window to a smaller height, **When** the sidebar content overflows, **Then** the sidebar uses internal scroll and the page does not develop a vertical scrollbar

---

### User Story 3 - Collapsible Sidebar Sections (Priority: P2)

As a user, I want collapsible/expandable sections within each sidebar panel — especially the Keys tab with its action categories (Letters, Numbers, Function Keys, Modifiers, etc.) — so I can minimize visual clutter and focus on the category I need.

**Why this priority**: The Keys tab has ~130 action tokens across many categories. Collapsible sections reduce cognitive load and allow users to quickly navigate to the category they need. This builds on the existing collapsible category behavior but extends it to other panels.

**Independent Test**: Open the Keys tab, verify each action category (Letters, Numbers, Function Keys, etc.) has a clickable header that toggles the section open/closed. Collapsed sections show only the header with a visual indicator (chevron). Verify similar collapsible behavior exists in the Macros panel where appropriate.

**Acceptance Scenarios**:

1. **Given** the Keys tab is active, **When** I click a category header (e.g., "Letters"), **Then** the category section collapses to show only the header with a rotated chevron indicator
2. **Given** a category is collapsed, **When** I click its header again, **Then** the category expands to show all its action items
3. **Given** I search/filter in the Keys tab, **When** results match items in collapsed categories, **Then** those categories automatically expand to show matching items
4. **Given** I collapse several categories, **When** I switch to another tab and back, **Then** my collapse state is preserved
5. **Given** the Macros tab is active, **When** there are both macros and tap-and-hold entries, **Then** each section (Macros, Tap & Hold) has a collapsible header

---

### Edge Cases

- What happens when the viewport is very narrow (< 900px)? The responsive layout stacks the sidebar below the keyboard; collapsible sections help manage the limited vertical space.
- What happens when all categories in the Keys tab are collapsed? The panel shows only the category headers, significantly reducing the scroll area.
- What happens when the search filter is active and all categories are collapsed? Matching categories expand automatically; non-matching ones stay collapsed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The sidebar panel tabs (Keys, Lighting, Macros, Settings) MUST be rendered as a horizontal tab bar at the top of the side panel
- **FR-002**: The active panel tab MUST be visually distinguished from inactive tabs (distinct background color, text color, or border indicator)
- **FR-003**: The sidebar MUST NOT cause page-level vertical scrolling; all overflow MUST be handled by internal scrolling within the panel content area
- **FR-004**: The panel tab bar MUST remain fixed at the top of the sidebar and not scroll with the panel content
- **FR-005**: Each action category in the Keys tab MUST have a collapsible header with a visual toggle indicator (chevron)
- **FR-006**: Collapsed/expanded state for categories MUST persist when switching between panel tabs within the same session
- **FR-007**: When the search filter is active in the Keys tab, categories with matching items MUST automatically expand regardless of their saved collapse state
- **FR-008**: The Macros panel MUST have collapsible section headers for "Macros" and "Tap & Hold" groups when both contain entries
- **FR-009**: The Lighting panel sections (Effect Selector, Color Picker, Per-Key Color) MUST be visually grouped but do not require collapsible behavior (content is already compact)
- **FR-010**: The Settings panel MUST remain as-is (compact form controls that don't benefit from collapsing)

### Assumptions

- This is a CSS and UI-layer change only; no parser, data model, or file I/O changes are required
- The existing collapsible behavior in the Keys tab (action categories with chevrons) already implements FR-005/FR-006/FR-007 and serves as the pattern to follow
- The sidebar width (280px) remains unchanged
- The responsive breakpoint at 900px remains unchanged

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Panel tabs are immediately visible and accessible without scrolling when the app loads on a 1280x800 viewport
- **SC-002**: Switching between all four panel tabs completes instantly with no page scroll displacement
- **SC-003**: A user can collapse all Keys tab categories to see only category headers, reducing visible items to fewer than 15 rows
- **SC-004**: The browser page never shows a vertical scrollbar on viewports 800px tall or greater
- **SC-005**: All existing functionality (key remapping, lighting configuration, macro editing, settings management) remains fully operational after the redesign
