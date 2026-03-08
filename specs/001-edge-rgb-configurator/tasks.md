# Tasks: Edge RGB Configurator

**Input**: Design documents from `/specs/001-edge-rgb-configurator/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/file-formats.md

**Tests**: Not explicitly requested in the spec. Tests are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: Create project directory structure and app shell

- [x] T001 Create directory structure: `css/`, `js/parsers/`, `js/data/`, `js/ui/`, `js/io/`, `assets/`
- [x] T002 Create app shell HTML in `index.html` with layout regions (keyboard area, side panel, toolbar, profile tabs) and ES module script entry point
- [x] T003 [P] Create base stylesheet in `css/style.css` with CSS custom properties for theme colors, keyboard layout grid, panel styles, and key element styles
- [x] T004 [P] Create app entry point in `js/app.js` with application state object (activeProfile, selectedKey, dirtyFlags) and module imports

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Static data dictionaries, SVG keyboard, file I/O layer, and core rendering that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Define all 95 KeyPosition objects with token, label, row, col, side, width, and fnToken fields in `js/data/keys.js`. Export frozen `KEY_POSITIONS` array and `KEY_ORDER` array (105 entries for LED file output order). Source: research.md R6, Direct Programming Guide section 4.5
- [x] T006 [P] Define all ~130 ActionToken objects with token, label, and category fields in `js/data/actions.js`. Export frozen `ACTION_TOKENS` Map keyed by token. Source: research.md R6, Direct Programming Guide sections 4.4, 4.8, 4.9
- [x] T007 [P] Define all 14 LightingEffect definitions with token, label, hasColor, hasSpeed, hasDirection flags in `js/data/effects.js`. Freestyle has no token (it is the fallback when no effect line is present — the LED file starts directly with per-key color lines). Export frozen `EFFECTS` array. Source: data-model.md LightingEffect table, SmartSet source (lmFreestyle)
- [x] T008 [P] Create SVG keyboard layout in `assets/keyboard-layout.svg` with left and right halves as `<g>` groups. Each key is a `<rect>` (or `<path>` for irregular keys) with `data-token` attribute matching the position token, `data-side` attribute, and a `<text>` child for the key label. Trace from `assets/kinesis-freestyle-rgb-position-picture.png`
- [x] T009 [P] Implement File System Access API wrapper in `js/io/file-access.js`: `openDirectory()` calling `showDirectoryPicker()`, `readFile(handle, subdir, filename)`, `writeFile(handle, subdir, filename, content)`, `ensureSubdir(handle, name)`. All text I/O uses UTF-8
- [x] T010 [P] Implement upload/download fallback in `js/io/file-fallback.js`: `uploadDirectory()` using `<input type="file" webkitdirectory>`, `downloadFile(filename, content)` using `Blob` + `<a download>`. Export `isFileSystemAccessSupported()` detection function
- [x] T011 Implement SVG keyboard renderer in `js/ui/keyboard-view.js`: load SVG from `assets/keyboard-layout.svg` into a container element, attach click handlers to each key element, manage `.selected` CSS class on the currently selected key, expose `onKeySelected(callback)` event, and `setKeyColor(token, cssColor)` method for per-key coloring. Depends on T005, T008
- [x] T012 Wire up app initialization in `js/app.js`: on DOMContentLoaded, init keyboard view (T011), detect File System Access API support (T009/T010), show "Open Directory" button or upload controls accordingly, bind toolbar buttons. Depends on T011, T009, T010

**Checkpoint**: App loads, displays the SVG keyboard, keys are clickable, directory can be opened (Chrome) or files uploaded (Firefox)

---

## Phase 3: User Story 1 - Remap Keys (Priority: P1) MVP

**Goal**: Users can remap individual keys and save valid layout files to the working directory

**Independent Test**: Remap Caps Lock to Escape, save, copy `layout1.txt` to V-Drive, verify keyboard produces Escape when Caps Lock is pressed

### Implementation for User Story 1

- [x] T013 [US1] Implement layout file parser in `js/parsers/layout-parser.js`: `parseLayout(text)` returns `{ remaps: Remap[], macros: Macro[], tapAndHolds: TapAndHold[], rawLines: {index, text}[] }`. Parse remap lines `[position]>[action]` and FN remaps `fn [position]>[action]`. Preserve unrecognized lines with their original index for round-trip fidelity. Parse disabled lines (asterisk prefix). Handle empty files. Per contracts/file-formats.md
- [x] T014 [US1] Implement layout file generator in `js/parsers/layout-parser.js`: `generateLayout(layoutData)` returns a string with CRLF line endings. Output remaps as `[position]>[action]`, one per line, tokens lowercase. Interleave preserved raw lines at their original positions. Must round-trip: `generateLayout(parseLayout(text)) === text`
- [x] T015 [US1] Create action picker panel in `js/ui/key-item.js`: when a key is selected in the keyboard view, show a side panel listing all action tokens grouped by category (from `js/data/actions.js`). Include a search/filter input. Clicking an action token assigns it to the selected key and updates the app state
- [x] T016 [US1] Implement profile loading for layouts in `js/app.js`: when a directory is opened, read `layouts/layout1.txt` (default profile), parse it with `parseLayout()`, populate the keyboard view with remap indicators (CSS class `.remapped` on remapped keys, tooltip showing the assigned action). Display default key labels for non-remapped keys
- [x] T017 [US1] Implement save workflow in `js/app.js`: "Save" button calls `generateLayout()` with current state, writes to `layouts/layoutN.txt` via file-access or triggers download via file-fallback. Create `layouts/` subdirectory if missing. Show save confirmation in UI. Clear dirty flag on success
- [x] T018 [US1] Add input validation in `js/app.js`: before saving, verify all remap actions are valid tokens from `ACTION_TOKENS`. Show error for invalid tokens. Prevent saving files with validation errors. Satisfies FR-015
- [x] T019 [US1] Add FN layer toggle in `js/ui/keyboard-view.js`: a toggle button switches the keyboard view between base layer and FN layer. When in FN layer, show FN-specific remaps and the 8 unique FN tokens. Remap operations in FN mode prefix output with `fn`. Satisfies FR-013

**Checkpoint**: User Story 1 fully functional — can open a directory, view keyboard, remap keys on base and FN layers, save valid layout files

---

## Phase 4: User Story 2 - Configure RGB Lighting (Priority: P2)

**Goal**: Users can select lighting effects, configure parameters, assign per-key colors, and save valid LED files

**Independent Test**: Set Monochrome effect to solid red, save, copy `led1.txt` to V-Drive, verify keyboard displays solid red

### Implementation for User Story 2

- [x] T020 [US2] Implement LED file parser in `js/parsers/led-parser.js`: `parseLed(text)` returns `{ effect: LightingEffect, baseColor: Color?, perKeyColors: PerKeyColor[], fnEffect: LightingEffect?, fnPerKeyColors: PerKeyColor[], rawLines: {index, text}[] }`. Parse effect line `[effect]>[params]`, base color line `[mono]>[R][G][B]`, per-key colors `[key]>[R][G][B]`, FN entries prefixed with `fn`. If the first line has no recognized effect token but contains per-key color data, set effect to Freestyle (no effect line in output). Per contracts/file-formats.md
- [x] T021 [US2] Implement LED file generator in `js/parsers/led-parser.js`: `generateLed(ledData)` returns a string with CRLF line endings. Effect line first, base color second (if applicable), per-key colors in KEY_ORDER, FN entries after base layer. Must round-trip: `generateLed(parseLed(text)) === text`
- [x] T022 [US2] Create effect selector panel in `js/ui/effect-selector.js`: dropdown listing all 14 effects from `js/data/effects.js`. When an effect is selected, show applicable parameter controls: color picker (if hasColor), speed slider 1-9 (if hasSpeed), direction buttons (if hasDirection). For Freestyle, show only the per-key color mode (no effect parameters). Update app state on change
- [x] T023 [US2] Integrate HTML5 color picker in `js/ui/color-picker.js`: wrap `<input type="color">` for effect-level color selection. Add RGB number inputs (0-255) for precise control. Convert between hex (for the input) and `{red, green, blue}` object. Expose `onColorChanged(callback)` event
- [x] T024 [US2] Implement per-key color mode in `js/ui/color-picker.js`: when Freestyle or Breathe effect is active, clicking a key on the keyboard view opens the color picker for that specific key. Apply the selected color to the SVG key element via `setKeyColor()`. Store per-key colors in app state. Show all 95 keys with their assigned colors on the keyboard view
- [x] T025 [US2] Implement LED profile loading in `js/app.js`: when a directory is opened, also read `lighting/ledN.txt`, parse it, populate the effect selector with current settings, and render per-key colors on the keyboard view. Handle empty LED files (keyboard defaults)
- [x] T026 [US2] Implement LED save workflow in `js/app.js`: "Save" button also generates LED file content via `generateLed()` and writes to `lighting/ledN.txt`. Create `lighting/` subdirectory if missing

**Checkpoint**: User Story 2 fully functional — can configure any of the 14 lighting effects, assign per-key colors, save valid LED files

---

## Phase 5: User Story 3 - Create and Edit Macros (Priority: P3)

**Goal**: Users can create macros with trigger keys, action sequences, speed/multiplay, and save them in layout files

**Independent Test**: Create a macro on HK1 that types "hello", save, copy to V-Drive, verify keyboard plays back the sequence

### Implementation for User Story 3

- [ ] T027 [US3] Extend layout parser in `js/parsers/layout-parser.js` to parse macro lines: `{trigger}{co_trigger}>{s_N}{x_N}{action1}{action2}...`. Handle optional co-trigger, optional speed prefix `{s_N}`, optional multiplay prefix `{x_N}`, special modifiers (`{-key}`, `{+key}`, `{dNNN}`, `{dran}`), and FN macros prefixed with `fn`
- [ ] T028 [US3] Extend layout generator in `js/parsers/layout-parser.js` to output macro lines in curly-brace syntax. Macros output after remaps. Include speed/multiplay prefixes when set
- [ ] T029 [US3] Create macro editor UI in `js/ui/macro-editor.js`: modal or panel that allows selecting a trigger key, optionally selecting a modifier co-trigger, building an action sequence by clicking keys or typing, setting speed (1-9) and multiplay (1-9). Show a live preview of the generated macro syntax. "Save Macro" adds it to the profile's macro list
- [ ] T030 [US3] Implement tap-and-hold parsing and generation in `js/parsers/layout-parser.js`: parse `[position]>[tap_action][t&hNNN][hold_action]` lines. Generate them in the same format. Add tap-and-hold configuration to the macro editor UI with a delay slider (1-999ms)
- [ ] T031 [US3] Display existing macros in the UI: show a list of current macros in the side panel with trigger key, action summary, and edit/delete buttons. Clicking a macro opens it in the macro editor for modification

**Checkpoint**: User Story 3 fully functional — can create, edit, delete macros and tap-and-hold bindings, save them in layout files

---

## Phase 6: User Story 4 - Manage Profiles (Priority: P4)

**Goal**: Users can switch between 9 profiles, each with independent layout and lighting configuration

**Independent Test**: Edit profile 2 layout, save, copy to V-Drive, switch keyboard to profile 2, verify changes apply

### Implementation for User Story 4

- [ ] T032 [US4] Create profile tab bar in `js/ui/profile-tabs.js`: render 9 numbered tabs (1-9) below the toolbar. Clicking a tab switches the active profile. Show a dirty indicator (dot/asterisk) on tabs with unsaved changes. Highlight the active tab
- [ ] T033 [US4] Implement profile switching in `js/app.js`: when switching profiles, save current state in memory, load the target profile's `layoutN.txt` and `ledN.txt` from the working directory (or from cached state if already loaded). If current profile has unsaved changes, show a confirmation prompt before switching
- [ ] T034 [US4] Implement profile duplication in `js/app.js`: "Duplicate Profile" button copies the current profile's layout and LED data to a target profile number selected by the user. Write both `layoutN.txt` and `ledN.txt` for the target profile

**Checkpoint**: User Story 4 fully functional — can switch between 9 profiles, each with independent remaps and lighting

---

## Phase 7: User Story 5 - Manage Keyboard Settings (Priority: P5)

**Goal**: Users can view and edit global keyboard settings stored in `kbd_settings.txt`

**Independent Test**: Toggle game mode ON, save, copy `kbd_settings.txt` to V-Drive, verify keyboard enters game mode

### Implementation for User Story 5

- [ ] T035 [US5] Implement settings parser in `js/parsers/settings-parser.js`: `parseSettings(text)` returns a `KeyboardSettings` object. Parse key=value lines, preserve original field order and casing, handle unknown fields. `generateSettings(settings)` outputs with CRLF line endings. Must round-trip. Per contracts/file-formats.md
- [ ] T036 [US5] Create settings panel in `js/ui/settings-panel.js`: modal or slide-out panel showing all settings fields with appropriate controls — toggles for ON/OFF fields (`gameMode`, `nkroMode`, `programKeyLock`, `profileSyncMode`), number inputs for numeric fields (`macroSpeed`, `statusPlaySpeed`), dropdown for `startupFile` and `vdrive`
- [ ] T037 [US5] Wire settings I/O in `js/app.js`: load `settings/kbd_settings.txt` on directory open, save on settings panel confirmation. Create `settings/` subdirectory if missing

**Checkpoint**: User Story 5 fully functional — can view and edit all global keyboard settings

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that span multiple user stories

- [ ] T038 [P] Add error handling for I/O failures in `js/app.js`: catch and display user-friendly messages when directory becomes inaccessible, file write fails, or permission is denied. Satisfies edge case from spec
- [ ] T039 [P] Add round-trip fidelity validation: manually test that loading and saving each file type without changes produces byte-identical output. Fix any parser/generator discrepancies. Satisfies SC-006
- [ ] T040 [P] Add disabled line support in UI: show asterisk-prefixed lines in layout display as "disabled" entries with a toggle to enable/disable them
- [ ] T041 Add position token map reference in `index.html`: embed or link the `assets/kinesis-freestyle-rgb-position-picture.png` image so users can reference physical key positions. Satisfies FR-014
- [ ] T042 [P] Polish CSS in `css/style.css`: responsive layout for different screen sizes, hover states for all interactive elements, keyboard focus indicators for accessibility, consistent spacing and typography

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T004) — BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational (Phase 2) completion
  - User stories can proceed in priority order (P1 → P2 → P3 → P4 → P5)
  - US2 can start in parallel with US1 (different files, different parsers)
  - US4 (profiles) benefits from US1+US2 being done first but is independently testable
  - US5 is fully independent of all other stories
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1 - Remap Keys)**: After Foundational. No dependencies on other stories
- **US2 (P2 - RGB Lighting)**: After Foundational. Independent of US1 (different parser, different files)
- **US3 (P3 - Macros)**: After US1 (extends layout-parser.js created in US1)
- **US4 (P4 - Profiles)**: After Foundational. Benefits from US1+US2 for full profile content, but tab switching works independently
- **US5 (P5 - Settings)**: After Foundational. Fully independent

### Within Each User Story

- Parser before UI (parser provides data model)
- UI components before wiring in app.js
- Core functionality before edge case handling

### Parallel Opportunities

- T003+T004 (style.css + app.js skeleton) can run in parallel
- T005+T006+T007+T008+T009+T010 (all foundational data + I/O) can run in parallel
- T013+T014 (layout parser + generator) can run together, then T015-T019 sequentially
- T020+T021 (LED parser + generator) can run together
- T022+T023 (effect selector + color picker) can run in parallel
- US1 and US2 can run in parallel after Foundational
- US5 can run in parallel with any other story
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: Foundational Phase

```
# Launch all data definitions in parallel:
Task T005: "Define KeyPosition objects in js/data/keys.js"
Task T006: "Define ActionToken objects in js/data/actions.js"
Task T007: "Define LightingEffect definitions in js/data/effects.js"
Task T008: "Create SVG keyboard layout in assets/keyboard-layout.svg"
Task T009: "Implement File System Access API in js/io/file-access.js"
Task T010: "Implement upload/download fallback in js/io/file-fallback.js"

# Then sequentially (depends on above):
Task T011: "Implement keyboard-view.js" (needs T005, T008)
Task T012: "Wire up app.js initialization" (needs T011, T009, T010)
```

## Parallel Example: User Stories 1 + 2

```
# After Foundational, launch both stories in parallel:

# Stream A (US1):
Task T013: "Layout parser" → Task T014: "Layout generator"
Task T015: "Action picker panel"
Task T016: "Profile loading for layouts" (needs T013)
...

# Stream B (US2):
Task T020: "LED parser" → Task T021: "LED generator"
Task T022: "Effect selector" + Task T023: "Color picker" (parallel)
Task T024: "Per-key color mode"
...
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T012)
3. Complete Phase 3: User Story 1 - Remap Keys (T013-T019)
4. **STOP and VALIDATE**: Open directory, remap a key, save, copy to V-Drive, verify on keyboard
5. Deploy to GitHub Pages if ready

### Incremental Delivery

1. Setup + Foundational → App shell with clickable keyboard
2. Add US1 (Remaps) → MVP: key remapping works end-to-end
3. Add US2 (Lighting) → RGB lighting configuration
4. Add US3 (Macros) → Macro creation and editing
5. Add US4 (Profiles) → Multi-profile management
6. Add US5 (Settings) → Global settings panel
7. Polish → Error handling, round-trip validation, responsive CSS

### Suggested MVP Scope

**User Story 1 (Remap Keys)** alone constitutes a viable MVP. It delivers the core value proposition: configuring the Freestyle Edge RGB keyboard from any browser on any OS. Tasks T001-T019 (19 tasks) cover the full MVP.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
- All file writes use CRLF line endings per V-Drive contract
- SVG keyboard is the single most complex foundational asset (T008) — invest time in accurate key placement
