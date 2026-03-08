# Feature Specification: Edge RGB Configurator

**Feature Branch**: `001-edge-rgb-configurator`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Build a browser-based web application to configure key layouts and RGB lighting on the Kinesis Freestyle Edge RGB keyboard via its V-Drive"

## Clarifications

### Session 2026-03-07

- Q: Should the app handle V-Drive detection and ejection automatically? → A: No. The user handles mounting/unmounting the V-Drive manually. The app saves files to a local directory. The user manually copies files to/from the V-Drive for this MVP.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Remap Keys (Priority: P1)

A user wants to remap individual keys on their Freestyle Edge RGB keyboard from a Linux desktop. They open the app, select or create a working directory that mirrors the V-Drive structure (`layouts/`, `lighting/`, `settings/`), select a profile (1-9), pick a key on a visual keyboard representation, and assign a new action to it. They save the layout and the app writes the updated layout file to the local directory. The user then manually copies the files to the V-Drive to apply changes.

**Why this priority**: Key remapping is the most fundamental configuration capability. Without it, the app provides no value. This is the single feature that makes the app a viable MVP on Linux.

**Independent Test**: Can be fully tested by remapping a single key (e.g., Caps Lock to Escape), saving to the local directory, copying the layout file to the mounted V-Drive, ejecting, and verifying the keyboard now produces the remapped action.

**Acceptance Scenarios**:

1. **Given** the app is launched, **When** the user selects a working directory, **Then** the app loads existing layout and LED files from that directory (if present).
2. **Given** the app displays the current layout, **When** the user selects a key and assigns a new action, **Then** the change is reflected in the visual keyboard display.
3. **Given** the user has made remap changes, **When** the user saves, **Then** the app writes the updated `layoutN.txt` file to the working directory in the correct syntax (`[position]>[action]`).
4. **Given** a layout file already contains remaps, **When** the user opens the app and points to that directory, **Then** existing remaps are parsed and displayed correctly on the visual keyboard.

---

### User Story 2 - Configure RGB Lighting (Priority: P2)

A user wants to customize the RGB lighting effects on their keyboard. They open the app, select a profile, and choose from available lighting effects (Monochrome, Breathe, Wave, Spectrum, Reactive, Starlight, Rebound, Loop, Pulse, Rain, Fireball, Ripple, Freestyle, Pitch Black). For effects that support it, they configure color (RGB values), speed (1-9), and direction. For Freestyle and Breathe effects, they can assign per-key colors. The app writes the LED configuration to the local working directory.

**Why this priority**: RGB lighting is the second most requested feature after key remapping and is a unique selling point of the Edge RGB model. It is independently valuable — a user may only want lighting control without touching key layouts.

**Independent Test**: Can be fully tested by selecting a lighting effect (e.g., Monochrome solid red), saving to the working directory, copying the LED file to the V-Drive, and verifying the keyboard displays the chosen effect.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** the user selects a lighting effect and parameters, **Then** the app displays the selected effect name, parameters, and applies the effect color to the keyboard SVG as a static preview (animated effects show their base color on all keys).
2. **Given** the user has configured a lighting effect, **When** the user saves, **Then** the app writes the correct syntax to `ledN.txt` (e.g., `[mono]>[255][0][0]` for solid red).
3. **Given** the user selects the Freestyle effect, **When** the user clicks individual keys, **Then** they can assign a custom RGB color to each of the 95 keys.
4. **Given** the user selects the Breathe effect, **When** they configure it, **Then** they can set a speed and per-key colors.
5. **Given** an existing `ledN.txt` file in the working directory, **When** the app loads it, **Then** the current lighting configuration is parsed and displayed correctly.

---

### User Story 3 - Create and Edit Macros (Priority: P3)

A user wants to create keyboard macros that play back a sequence of keystrokes when a trigger key is pressed. They select a trigger key, optionally add a modifier co-trigger, and define the sequence of actions. They can set playback speed and multiplay count. The app writes the macro to the layout file using the curly-brace macro syntax.

**Why this priority**: Macros are a power-user feature that adds significant value but is not required for basic keyboard customization. Users who only need remaps and lighting can use the app without macros.

**Independent Test**: Can be fully tested by creating a macro (e.g., Hotkey 1 types "hello"), saving, copying to V-Drive, and verifying the keyboard plays back the sequence when the trigger key is pressed.

**Acceptance Scenarios**:

1. **Given** the user selects a trigger key, **When** they define a keystroke sequence, **Then** the app encodes it in the correct macro syntax (e.g., `{hk1}>{h}{e}{l}{l}{o}`).
2. **Given** the user wants a shifted character in a macro, **When** they add it, **Then** the app encodes the shift down/up strokes (e.g., `{-lshft}{h}{+lshft}` for capital H).
3. **Given** the user sets a custom playback speed, **When** they save, **Then** the speed prefix `{s_N}` is included in the macro output.
4. **Given** the user sets a multiplay count, **When** they save, **Then** the multiplay prefix `{x_N}` is included in the macro output.
5. **Given** a layout file contains existing macros, **When** the app loads it, **Then** macros are parsed and displayed in an editable form.

---

### User Story 4 - Manage Profiles (Priority: P4)

A user wants to switch between the 9 available keyboard profiles, each with its own layout and lighting configuration. They can view which profile is active, load a different profile's configuration for editing, and manage profile-specific settings.

**Why this priority**: Profile management is useful for users who maintain multiple configurations (e.g., one for work, one for gaming) but is not essential for basic single-profile use.

**Independent Test**: Can be fully tested by editing profile 2's layout, saving, copying to V-Drive, switching to profile 2 on the keyboard, and verifying the changes are applied.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** the user selects a profile number (1-9), **Then** the app loads the corresponding `layoutN.txt` and `ledN.txt` files from the working directory.
2. **Given** the user edits a profile, **When** they switch to a different profile, **Then** the app prompts to save unsaved changes.
3. **Given** the user wants to copy a configuration, **When** they duplicate a profile, **Then** the layout and LED files are copied to the target profile number.

---

### User Story 5 - Manage Keyboard Settings (Priority: P5)

A user wants to configure global keyboard settings such as macro playback speed, game mode, NKRO mode, and V-Drive auto-open behavior. These settings affect all profiles and are stored in `kbd_settings.txt`.

**Why this priority**: Global settings are rarely changed and can be edited manually in the text file. App support is a convenience, not a necessity.

**Independent Test**: Can be fully tested by toggling game mode on, saving, copying `kbd_settings.txt` to the V-Drive, and verifying the keyboard enters game mode.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** the user navigates to settings, **Then** the current values from `kbd_settings.txt` in the working directory are displayed.
2. **Given** the user changes a setting (e.g., `game_mode` from OFF to ON), **When** they save, **Then** the `kbd_settings.txt` file is updated in the working directory.

---

### Edge Cases

- What happens when the selected working directory does not contain V-Drive files?
  The app MUST create the expected directory structure (`layouts/`, `lighting/`, `settings/`) and start with empty/default configurations.
- What happens when a layout file contains syntax the app does not recognize?
  The app MUST preserve unrecognized lines verbatim when saving, so manual edits are not lost.
- What happens when layout files are empty?
  Empty layout files are valid (keyboard uses default actions). The app MUST display the default key assignments when a layout file is empty.
- What happens when the working directory becomes inaccessible during a session?
  The app MUST handle the I/O error gracefully and inform the user that the save failed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST allow the user to select a local working directory that mirrors the V-Drive structure (`layouts/`, `lighting/`, `settings/`).
- **FR-002**: The app MUST parse layout files (`layoutN.txt`) and correctly interpret remap syntax (`[position]>[action]`) and macro syntax (`{trigger}>{actions}`).
- **FR-003**: The app MUST parse LED files (`ledN.txt`) and correctly interpret effect syntax (`[effect]>[params]`) and per-key color syntax (`[key]>[R][G][B]`).
- **FR-004**: The app MUST parse global settings from `settings/kbd_settings.txt`.
- **FR-005**: The app MUST display a visual representation of the Freestyle Edge RGB keyboard layout showing all 95 keys in their physical positions.
- **FR-006**: Users MUST be able to select any key on the visual keyboard and assign a new action from the full Action Token Dictionary.
- **FR-007**: Users MUST be able to create macros with trigger keys, co-triggers, keystroke sequences, speed prefixes, and multiplay prefixes.
- **FR-008**: Users MUST be able to select and configure any of the 14 lighting effects with their applicable parameters (color, speed, direction).
- **FR-009**: Users MUST be able to assign per-key RGB colors when using Freestyle or Breathe lighting effects.
- **FR-010**: The app MUST write valid layout and LED files that the keyboard can parse without errors.
- **FR-011**: The app MUST preserve any lines in layout/LED files that it does not understand, to avoid destroying manual edits.
- **FR-012**: The app MUST support all 9 profiles (layout1-9.txt, led1-9.txt).
- **FR-013**: The app MUST support both the top layer and the FN layer for remaps, macros, and per-key lighting.
- **FR-014**: The app MUST display the Position Token Map so users know which token corresponds to which physical key.
- **FR-015**: The app MUST validate user input against the Action Token Dictionary before writing to layout files.
- **FR-016**: The app MUST create the V-Drive directory structure (`layouts/`, `lighting/`, `settings/`) in the working directory if it does not exist.

### Key Entities

- **Profile**: One of 9 keyboard configurations, each consisting of a layout file and a lighting file. Identified by number (1-9).
- **Key Position**: A physical key on the keyboard, identified by its position token (e.g., `esc`, `hk1`, `lshft`). Each key has a top-layer and an FN-layer position.
- **Key Action**: An action assigned to a key position, identified by its action token (e.g., `caps`, `vol+`, `lmous`). Includes standard keys, modifiers, media keys, mouse buttons, and special functions.
- **Remap**: A binding of one key position to a different action. Stored as `[position]>[action]` in layout files.
- **Macro**: A sequence of actions triggered by a key press. Stored as `{trigger}>{actions}` in layout files. Has optional speed and multiplay prefixes.
- **Lighting Effect**: A keyboard-level LED configuration. One of 14 effect types, each with specific parameters (color, speed, direction).
- **Per-Key Color**: An RGB color (0-255 per channel) assigned to a specific key position. Used with Freestyle and Breathe effects.
- **Keyboard Settings**: Global settings stored in `kbd_settings.txt` affecting all profiles (macro speed, game mode, NKRO, V-Drive behavior).
- **Working Directory**: A local filesystem directory selected by the user that mirrors the V-Drive structure. The user manually copies files between this directory and the V-Drive.

### Assumptions

- The user has a Kinesis Freestyle Edge RGB keyboard with firmware version 1.0.121 or later.
- The user is responsible for mounting/unmounting the V-Drive and copying files between the local working directory and the V-Drive.
- The app runs as a single-user browser-based web application (static site, no backend).
- The keyboard uses the English (US) keyboard layout for position token interpretation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can remap a key and save it to the working directory in under 60 seconds from app launch.
- **SC-002**: Users can configure any of the 14 lighting effects and save it to the working directory in under 60 seconds from app launch.
- **SC-003**: All 95 key positions are visually represented and individually selectable on the keyboard display.
- **SC-004**: Layout files generated by the app are 100% compatible with the keyboard's parser (no rejected lines).
- **SC-005**: LED files generated by the app are 100% compatible with the keyboard's parser.
- **SC-006**: The app correctly round-trips existing configuration files: loading a file and saving it without changes produces an identical file.
