# Data Model: Edge RGB Configurator

**Branch**: `001-edge-rgb-configurator` | **Date**: 2026-03-07

## Entities

### Color

RGB color value used for LED configuration.

| Field | Type   | Constraints |
|-------|--------|-------------|
| red   | number | Integer 0-255 |
| green | number | Integer 0-255 |
| blue  | number | Integer 0-255 |

**JS representation**: Plain object `{ red, green, blue }`
**Format**: `[RRR][GGG][BBB]` in LED files (e.g., `[255][0][128]`)

---

### KeyPosition

A physical key on the keyboard identified by its position token.

| Field    | Type    | Constraints |
|----------|---------|-------------|
| token    | string  | From position token dictionary (95 values) |
| label    | string  | Human-readable label for display |
| row      | number  | Physical row on keyboard (0-5) |
| col      | number  | Physical column position |
| side     | string  | `"left"` or `"right"` |
| width    | number  | Relative key width (1.0 = standard, 1.5 = wide, etc.) |
| fnToken  | string? | Unique FN-layer token if different (8 keys only) |

**JS representation**: Plain object in a frozen array (`KEY_POSITIONS`)

---

### ActionToken

An action that can be assigned to a key position.

| Field    | Type   | Constraints |
|----------|--------|-------------|
| token    | string | From action token dictionary |
| label    | string | Human-readable label |
| category | string | `"letter"`, `"number"`, `"function"`, `"modifier"`, `"punctuation"`, `"navigation"`, `"editing"`, `"media"`, `"mouse"`, `"keypad"`, `"lock"`, `"special"`, `"international"` |

**JS representation**: Plain object in a frozen `Map` keyed by token

---

### Remap

A single key remapping in a layout file.

| Field    | Type        | Constraints |
|----------|-------------|-------------|
| position | string      | Valid position token |
| action   | string      | Valid action token |
| isFn     | boolean     | True if this is an FN-layer remap |

**Format**: `[position]>[action]` or `fn [position]>[action]`

---

### Macro

A macro definition in a layout file.

| Field      | Type     | Constraints |
|------------|----------|-------------|
| trigger    | string   | Non-modifier position token |
| coTrigger  | string?  | Optional modifier co-trigger token |
| actions    | string[] | Sequence of keystroke action tokens |
| speed      | number?  | 1-9, optional playback speed |
| multiplay  | number?  | 1-9, optional repeat count |
| isFn       | boolean  | True if FN-layer macro |

**Format**: `{trigger}{co_trigger}>{s_N}{x_N}{action1}{action2}...`

Special action modifiers within macros:
- `{-key}` = key down (hold)
- `{+key}` = key up (release)
- `{dNNN}` = delay in milliseconds (1-999)
- `{dran}` = random delay

---

### TapAndHold

A tap-and-hold action assignment.

| Field      | Type   | Constraints |
|------------|--------|-------------|
| position   | string | Target position token |
| tapAction  | string | Action token on short press |
| holdAction | string | Action token on long press |
| delayMs    | number | 1-999 milliseconds |

**Format**: `[position]>[tap_action][t&hNNN][hold_action]`

---

### LightingEffect

A keyboard-level LED effect configuration.

| Field     | Type    | Constraints |
|-----------|---------|-------------|
| effect    | string  | See effect types below |
| color     | Color?  | Required for some effects |
| speed     | number? | 1-9, required for some effects |
| direction | string? | `"dirup"`, `"dirdown"`, `"dirleft"`, `"dirright"` |

**Effect types and parameters**:

| Effect      | Token        | Color | Speed | Direction |
|-------------|--------------|-------|-------|-----------|
| Freestyle   | *(none)*     | No*   | No    | No        |
| Monochrome  | `[mono]`     | Yes   | No    | No        |
| Breathe     | `[breathe]`  | No*   | Yes   | No        |
| Wave        | `[wave]`     | No    | Yes   | Yes       |
| Spectrum    | `[spectrum]` | No    | Yes   | No        |
| Reactive    | `[reactive]` | Yes   | Yes   | No        |
| Starlight   | `[star]`     | Yes   | Yes   | No        |
| Rebound     | `[rebound]`  | Yes   | Yes   | Yes       |
| Loop        | `[loop]`     | Yes   | Yes   | Yes       |
| Pulse       | `[pulse]`    | No    | Yes   | No        |
| Rain        | `[rain]`     | Yes   | Yes   | No        |
| Fireball    | `[fireball]` | Yes   | Yes   | No        |
| Ripple      | `[ripple]`   | Yes   | Yes   | No        |
| Pitch Black | `[black]`    | No    | No    | No        |

*Freestyle and Breathe use per-key colors, not effect-level color.

---

### PerKeyColor

A per-key RGB color assignment (used with Freestyle and Breathe effects).

| Field    | Type    | Constraints |
|----------|---------|-------------|
| position | string  | Any of the 95 position tokens |
| color    | Color   | RGB value |
| isFn     | boolean | True if FN-layer color |

**Format**: `[key]>[RRR][GGG][BBB]` or `fn [key]>[RRR][GGG][BBB]`

---

### Profile

One of 9 keyboard configuration profiles.

| Field        | Type            | Constraints |
|--------------|-----------------|-------------|
| number       | number          | 1-9 |
| remaps       | Remap[]         | Top and FN layer remaps |
| macros       | Macro[]         | Top and FN layer macros |
| tapAndHolds  | TapAndHold[]    | Max 10 per layout |
| effect       | LightingEffect  | Keyboard-level effect |
| fnEffect     | LightingEffect? | FN-layer effect (optional) |
| perKeyColors | PerKeyColor[]   | For Freestyle/Breathe |
| baseColor    | Color?          | Base color for two-tone effects |
| rawLayout    | string[]        | Unrecognized layout lines (preserved) |
| rawLighting  | string[]        | Unrecognized LED lines (preserved) |
| dirty        | boolean         | True if modified since last save |

**Files**: `layouts/layoutN.txt` and `lighting/ledN.txt`

---

### KeyboardSettings

Global settings affecting all profiles.

| Field            | Type   | Constraints |
|------------------|--------|-------------|
| profileSyncMode  | string | `"ON"` or `"OFF"` |
| startupFile      | string | Layout file name |
| ledMode          | string | Active lighting effect name |
| macroSpeed       | number | 0-9 (0 = disabled, default 5) |
| gameMode         | string | `"ON"` or `"OFF"` |
| nkroMode         | string | `"ON"` or `"OFF"` |
| statusPlaySpeed  | number | 0-4 (0 = disabled, default 3) |
| programKeyLock   | string | `"ON"` or `"OFF"` |
| vdrive           | string | `"auto"` or `"manual"` |

**File**: `settings/kbd_settings.txt`

---

### WorkingDirectory

The local directory (or `FileSystemDirectoryHandle`) the app reads
from and writes to.

| Field        | Type    | Constraints |
|--------------|---------|-------------|
| handle       | object? | `FileSystemDirectoryHandle` (Chrome/Edge) |
| hasLayouts   | boolean | Whether `layouts/` subdir exists |
| hasLighting  | boolean | Whether `lighting/` subdir exists |
| hasSettings  | boolean | Whether `settings/` subdir exists |

The app creates missing subdirectories automatically when saving.
In fallback mode (Firefox), files are uploaded individually and
downloaded as a zip or individual files.

---

## Entity Relationships

```
WorkingDirectory
  └── contains 9x Profile
        ├── layout file → Remap[] + Macro[] + TapAndHold[]
        └── lighting file → LightingEffect + PerKeyColor[]
  └── contains 1x KeyboardSettings

KeyPosition (95 instances, static, frozen)
  ├── referenced by Remap.position
  ├── referenced by Macro.trigger
  ├── referenced by PerKeyColor.position
  └── referenced by TapAndHold.position

ActionToken (130+ instances, static, frozen Map)
  ├── referenced by Remap.action
  ├── referenced by Macro.actions[]
  └── referenced by TapAndHold.tapAction / holdAction
```

## State Transitions

### Profile (edit lifecycle)

```
CLEAN → MODIFIED (user makes a change)
MODIFIED → SAVING (user triggers save)
SAVING → CLEAN (write succeeds, file matches in-memory state)
MODIFIED → CLEAN (user discards changes)
```

The `dirty` flag on each Profile tracks whether it has unsaved changes.
The UI shows a visual indicator (e.g., dot on the profile tab) when
a profile is dirty.
