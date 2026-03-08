# File Format Contracts: Edge RGB Configurator

This document defines the file format contracts the app MUST parse
(read) and generate (write) to be compatible with the Freestyle Edge
RGB keyboard's V-Drive.

## Layout File Contract (`layouts/layoutN.txt`)

### Read Contract (Parser)

The parser MUST handle these line types:

1. **Remap**: `[position]>[action]`
   - Tokens are case-insensitive
   - Position and action enclosed in square brackets
   - Separated by `>`

2. **FN Remap**: `fn [position]>[action]`
   - Prefixed with `fn ` (lowercase, with space)

3. **Macro**: `{trigger}{co_trigger}>{s_N}{x_N}{action1}{action2}...`
   - Trigger and actions in curly braces
   - Co-trigger is optional (modifier key)
   - Speed prefix `{s_N}` is optional (N = 1-9)
   - Multiplay prefix `{x_N}` is optional (N = 1-9)

4. **FN Macro**: `fn {trigger}>{actions}...`

5. **Tap-and-Hold**: `[position]>[tap_action][t&hNNN][hold_action]`
   - NNN = delay in milliseconds (1-999)

6. **Disabled line**: `*[rest of line]` or `*{rest of line}`
   - Asterisk prefix disables the line

7. **Empty line**: skip

8. **Unrecognized line**: preserve verbatim for round-trip fidelity

### Write Contract (Generator)

- Output one entry per line
- Use CRLF line endings (`\r\n`)
- Tokens in lowercase
- Remaps before macros (convention, not required by keyboard)
- Preserve unrecognized lines at their original position

## LED File Contract (`lighting/ledN.txt`)

### Read Contract (Parser)

1. **Keyboard effect**: `[effect]>[param1][param2]...`
   - First line typically defines the effect type
   - Parameters vary by effect (see data-model.md)
   - **Freestyle mode**: No effect line present — file starts directly
     with per-key color lines. This is the fallback when no recognized
     effect token is found on the first line

2. **Per-key color**: `[key]>[RRR][GGG][BBB]`
   - Used with Freestyle and Breathe effects
   - RGB values are 0-255 integers

3. **FN per-key color**: `fn [key]>[RRR][GGG][BBB]`

4. **Base color (two-tone)**: `[mono]>[RRR][GGG][BBB]`
   - Written on line 2 for effects that support base color
   - Used with: Rain, Loop, Rebound, Starlight, Reactive, Ripple,
     Fireball

5. **FN effect**: `fn [effect]>[params]`

6. **Empty file**: valid (lighting disabled / keyboard default)

7. **Unrecognized line**: preserve verbatim

### Write Contract (Generator)

- Effect line first
- Base color line second (if applicable)
- Per-key colors follow in KEY_ORDER
- FN-layer entries after base layer entries
- CRLF line endings (`\r\n`)
- Preserve unrecognized lines

## Settings File Contract (`settings/kbd_settings.txt`)

### Read Contract (Parser)

Key-value pairs, one per line. Expected fields:

```
profile_sync_mode=ON
startup_file=layout1.txt
Led_mode=mono
macro_speed=5
game_mode=OFF
nkro_mode=OFF
status_play_speed=3
program_key_lock=OFF
v-drive=auto
```

### Write Contract (Generator)

- Preserve original field order
- Preserve any unrecognized fields
- Use original field name casing
- CRLF line endings

## Working Directory Structure

The app expects the working directory to mirror the V-Drive layout:

```
<working_dir>/
├── layouts/
│   ├── layout1.txt    (through layout9.txt)
│   └── ...
├── lighting/
│   ├── led1.txt       (through led9.txt)
│   └── ...
└── settings/
    └── kbd_settings.txt
```

If subdirectories are missing, the app creates them on first save.
Missing files are treated as empty (keyboard defaults apply).

## Round-Trip Fidelity

For all file types: loading a file and saving it without changes MUST
produce byte-identical output. This is SC-006 from the spec.
