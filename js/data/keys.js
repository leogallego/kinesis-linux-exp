/**
 * KeyPosition definitions for the Kinesis Freestyle Edge RGB.
 * Source: Direct Programming Guide section 4.5 Position Token Map.
 *
 * Each entry: { token, label, row, col, side, width, fnToken }
 *   - width is in key units (1 = standard, 1.25/1.5/2/6.5 = wider)
 *   - fnToken is set only for the 8 keys with unique FN-layer tokens
 */

/** @type {ReadonlyArray<KeyPosition>} */
export const KEY_POSITIONS = Object.freeze([
  // === LEFT HALF ===

  // Row 0
  { token: 'hk0',   label: 'HK0',    row: 0, col: 0,  side: 'left',  width: 1,    fnToken: null },
  { token: 'esc',   label: 'Esc',     row: 0, col: 1,  side: 'left',  width: 1,    fnToken: null },
  { token: 'f1',    label: 'F1',      row: 0, col: 2,  side: 'left',  width: 1,    fnToken: null },
  { token: 'f2',    label: 'F2',      row: 0, col: 3,  side: 'left',  width: 1,    fnToken: null },
  { token: 'f3',    label: 'F3',      row: 0, col: 4,  side: 'left',  width: 1,    fnToken: null },
  { token: 'f4',    label: 'F4',      row: 0, col: 5,  side: 'left',  width: 1,    fnToken: null },
  { token: 'f5',    label: 'F5',      row: 0, col: 6,  side: 'left',  width: 1,    fnToken: null },
  { token: 'f6',    label: 'F6',      row: 0, col: 7,  side: 'left',  width: 1,    fnToken: null },

  // Row 1
  { token: 'hk1',   label: 'HK1',    row: 1, col: 0,  side: 'left',  width: 1,    fnToken: null },
  { token: 'hk2',   label: 'HK2',    row: 1, col: 1,  side: 'left',  width: 1,    fnToken: null },
  { token: 'tilde', label: '~',      row: 1, col: 2,  side: 'left',  width: 1,    fnToken: null },
  { token: '1',     label: '1',      row: 1, col: 3,  side: 'left',  width: 1,    fnToken: null },
  { token: '2',     label: '2',      row: 1, col: 4,  side: 'left',  width: 1,    fnToken: null },
  { token: '3',     label: '3',      row: 1, col: 5,  side: 'left',  width: 1,    fnToken: null },
  { token: '4',     label: '4',      row: 1, col: 6,  side: 'left',  width: 1,    fnToken: null },
  { token: '5',     label: '5',      row: 1, col: 7,  side: 'left',  width: 1,    fnToken: null },
  { token: '6',     label: '6',      row: 1, col: 8,  side: 'left',  width: 1,    fnToken: null },

  // Row 2
  { token: 'hk3',   label: 'HK3',    row: 2, col: 0,  side: 'left',  width: 1,    fnToken: null },
  { token: 'hk4',   label: 'HK4',    row: 2, col: 1,  side: 'left',  width: 1,    fnToken: null },
  { token: 'tab',   label: 'Tab',    row: 2, col: 2,  side: 'left',  width: 1.5,  fnToken: null },
  { token: 'q',     label: 'Q',      row: 2, col: 3.5,side: 'left',  width: 1,    fnToken: null },
  { token: 'w',     label: 'W',      row: 2, col: 4.5,side: 'left',  width: 1,    fnToken: null },
  { token: 'e',     label: 'E',      row: 2, col: 5.5,side: 'left',  width: 1,    fnToken: null },
  { token: 'r',     label: 'R',      row: 2, col: 6.5,side: 'left',  width: 1,    fnToken: null },
  { token: 't',     label: 'T',      row: 2, col: 7.5,side: 'left',  width: 1,    fnToken: null },

  // Row 3
  { token: 'hk5',   label: 'HK5',    row: 3, col: 0,  side: 'left',  width: 1,    fnToken: null },
  { token: 'hk6',   label: 'HK6',    row: 3, col: 1,  side: 'left',  width: 1,    fnToken: null },
  { token: 'caps',  label: 'Caps',   row: 3, col: 2,  side: 'left',  width: 1.75, fnToken: null },
  { token: 'a',     label: 'A',      row: 3, col: 3.75,side: 'left', width: 1,    fnToken: null },
  { token: 's',     label: 'S',      row: 3, col: 4.75,side: 'left', width: 1,    fnToken: null },
  { token: 'd',     label: 'D',      row: 3, col: 5.75,side: 'left', width: 1,    fnToken: null },
  { token: 'f',     label: 'F',      row: 3, col: 6.75,side: 'left', width: 1,    fnToken: null },
  { token: 'g',     label: 'G',      row: 3, col: 7.75,side: 'left', width: 1,    fnToken: null },

  // Row 4
  { token: 'hk7',   label: 'HK7',    row: 4, col: 0,  side: 'left',  width: 1,    fnToken: null },
  { token: 'hk8',   label: 'HK8',    row: 4, col: 1,  side: 'left',  width: 1,    fnToken: null },
  { token: 'lshft', label: 'LShift', row: 4, col: 2,  side: 'left',  width: 2.25, fnToken: null },
  { token: 'z',     label: 'Z',      row: 4, col: 4.25,side: 'left', width: 1,    fnToken: null },
  { token: 'x',     label: 'X',      row: 4, col: 5.25,side: 'left', width: 1,    fnToken: null },
  { token: 'c',     label: 'C',      row: 4, col: 6.25,side: 'left', width: 1,    fnToken: null },
  { token: 'v',     label: 'V',      row: 4, col: 7.25,side: 'left', width: 1,    fnToken: null },
  { token: 'b',     label: 'B',      row: 4, col: 8.25,side: 'left', width: 1,    fnToken: null },

  // Row 5
  { token: 'hk9',   label: 'HK9',    row: 5, col: 0,  side: 'left',  width: 1,    fnToken: null },
  { token: 'hk10',  label: 'HK10',   row: 5, col: 1,  side: 'left',  width: 1,    fnToken: null },
  { token: 'lctrl', label: 'LCtrl',  row: 5, col: 2,  side: 'left',  width: 1.25, fnToken: null },
  { token: 'lwin',  label: 'LWin',   row: 5, col: 3.25,side: 'left', width: 1.25, fnToken: null },
  { token: 'lalt',  label: 'LAlt',   row: 5, col: 4.5, side: 'left', width: 1.25, fnToken: null },
  { token: 'lspc',  label: 'Space',  row: 5, col: 5.75,side: 'left', width: 3.5,  fnToken: null },

  // === RIGHT HALF ===

  // Row 0
  { token: 'f7',    label: 'F7',     row: 0, col: 0,  side: 'right', width: 1,    fnToken: null },
  { token: 'f8',    label: 'F8',     row: 0, col: 1,  side: 'right', width: 1,    fnToken: null },
  { token: 'f9',    label: 'F9',     row: 0, col: 2,  side: 'right', width: 1,    fnToken: null },
  { token: 'f10',   label: 'F10',    row: 0, col: 3,  side: 'right', width: 1,    fnToken: null },
  { token: 'f11',   label: 'F11',    row: 0, col: 4,  side: 'right', width: 1,    fnToken: null },
  { token: 'f12',   label: 'F12',    row: 0, col: 5,  side: 'right', width: 1,    fnToken: null },
  { token: 'prnt',  label: 'PrtSc',  row: 0, col: 6,  side: 'right', width: 1,    fnToken: null },
  { token: 'pause', label: 'Pause',  row: 0, col: 7,  side: 'right', width: 1,    fnToken: 'ins' },
  { token: 'del',   label: 'Del',    row: 0, col: 8,  side: 'right', width: 1,    fnToken: 'scrlk' },

  // Row 1
  { token: '7',     label: '7',      row: 1, col: 0,  side: 'right', width: 1,    fnToken: null },
  { token: '8',     label: '8',      row: 1, col: 1,  side: 'right', width: 1,    fnToken: null },
  { token: '9',     label: '9',      row: 1, col: 2,  side: 'right', width: 1,    fnToken: null },
  { token: '0',     label: '0',      row: 1, col: 3,  side: 'right', width: 1,    fnToken: null },
  { token: 'hyph',  label: '-',      row: 1, col: 4,  side: 'right', width: 1,    fnToken: null },
  { token: '=',     label: '=',      row: 1, col: 5,  side: 'right', width: 1,    fnToken: null },
  { token: 'bspc',  label: 'Bksp',   row: 1, col: 6,  side: 'right', width: 2,    fnToken: null },
  { token: 'home',  label: 'Home',   row: 1, col: 8,  side: 'right', width: 1,    fnToken: null },

  // Row 2
  { token: 'y',     label: 'Y',      row: 2, col: 0.5, side: 'right', width: 1,   fnToken: null },
  { token: 'u',     label: 'U',      row: 2, col: 1.5, side: 'right', width: 1,   fnToken: null },
  { token: 'i',     label: 'I',      row: 2, col: 2.5, side: 'right', width: 1,   fnToken: null },
  { token: 'o',     label: 'O',      row: 2, col: 3.5, side: 'right', width: 1,   fnToken: null },
  { token: 'p',     label: 'P',      row: 2, col: 4.5, side: 'right', width: 1,   fnToken: null },
  { token: 'obrk',  label: '[',      row: 2, col: 5.5, side: 'right', width: 1,   fnToken: null },
  { token: 'cbrk',  label: ']',      row: 2, col: 6.5, side: 'right', width: 1,   fnToken: null },
  { token: '\\',    label: '\\',     row: 2, col: 7.5, side: 'right', width: 1.5, fnToken: null },
  { token: 'end',   label: 'End',    row: 2, col: 9,   side: 'right', width: 1,   fnToken: null },

  // Row 3
  { token: 'h',     label: 'H',      row: 3, col: 0.75,side: 'right', width: 1,   fnToken: null },
  { token: 'j',     label: 'J',      row: 3, col: 1.75,side: 'right', width: 1,   fnToken: null },
  { token: 'k',     label: 'K',      row: 3, col: 2.75,side: 'right', width: 1,   fnToken: null },
  { token: 'l',     label: 'L',      row: 3, col: 3.75,side: 'right', width: 1,   fnToken: null },
  { token: 'colon', label: ';',      row: 3, col: 4.75,side: 'right', width: 1,   fnToken: null },
  { token: 'apos',  label: "'",      row: 3, col: 5.75,side: 'right', width: 1,   fnToken: null },
  { token: 'ent',   label: 'Enter',  row: 3, col: 6.75,side: 'right', width: 2.25,fnToken: null },
  { token: 'pup',   label: 'PgUp',   row: 3, col: 9,   side: 'right', width: 1,   fnToken: null },

  // Row 4
  { token: 'n',     label: 'N',      row: 4, col: 1.25,side: 'right', width: 1,   fnToken: null },
  { token: 'm',     label: 'M',      row: 4, col: 2.25,side: 'right', width: 1,   fnToken: null },
  { token: 'com',   label: ',',      row: 4, col: 3.25,side: 'right', width: 1,   fnToken: null },
  { token: 'per',   label: '.',      row: 4, col: 4.25,side: 'right', width: 1,   fnToken: null },
  { token: '/',     label: '/',      row: 4, col: 5.25,side: 'right', width: 1,   fnToken: null },
  { token: 'rshft', label: 'RShift', row: 4, col: 6.25,side: 'right', width: 1.75,fnToken: null },
  { token: 'up',    label: 'Up',     row: 4, col: 8,   side: 'right', width: 1,   fnToken: null },
  { token: 'pdn',   label: 'PgDn',   row: 4, col: 9,   side: 'right', width: 1,   fnToken: null },

  // Row 5
  { token: 'rspc',  label: 'Space',  row: 5, col: 0,   side: 'right', width: 2.75,fnToken: null },
  { token: 'ralt',  label: 'RAlt',   row: 5, col: 2.75,side: 'right', width: 1.25,fnToken: null },
  { token: 'rctrl', label: 'RCtrl',  row: 5, col: 4,   side: 'right', width: 1.25,fnToken: null },
  { token: 'lft',   label: 'Left',   row: 5, col: 7,   side: 'right', width: 1,   fnToken: null },
  { token: 'dwn',   label: 'Down',   row: 5, col: 8,   side: 'right', width: 1,   fnToken: null },
  { token: 'rght',  label: 'Right',  row: 5, col: 9,   side: 'right', width: 1,   fnToken: null },
]);

/**
 * KEY_ORDER: canonical output order for LED files (105 entries).
 * Includes all 95 physical keys plus the 10 letter keys a-j that
 * appear in the Monkeypaint canonical order. Matches repomix-monkeypaint.xml.
 * Source: Monkeypaint KEY_ORDER.
 */
export const KEY_ORDER = Object.freeze([
  // Row 0
  'hk0', 'esc',
  'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
  'prnt', 'pause', 'del',
  // Row 1
  'hk1', 'hk2', 'tilde',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'hyph', '=', 'bspc', 'home',
  // Row 2
  'hk3', 'hk4', 'tab',
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'obrk', 'cbrk', '\\', 'end',
  // Row 3
  'hk5', 'hk6', 'caps',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  'colon', 'apos', 'ent', 'pup',
  // Row 4
  'hk7', 'hk8', 'lshft',
  'z', 'x', 'c', 'v', 'b', 'n', 'm',
  'com', 'per', '/',
  'rshft', 'up', 'pdn',
  // Row 5
  'hk9', 'hk10', 'lctrl', 'lwin', 'lalt',
  'lspc', 'rspc',
  'ralt', 'rctrl',
  'lft', 'dwn', 'rght',
]);

/** Set of all valid position tokens for quick lookup. */
export const KEY_SET = Object.freeze(new Set(KEY_ORDER));

/**
 * FN-layer unique position tokens.
 * These 8 keys have different tokens when referenced in the FN layer for LED files.
 */
export const FN_UNIQUE_TOKENS = Object.freeze({
  'f1':    'mute',
  'f2':    'vol+',
  'f3':    'vol-',
  'f4':    'play',
  'f5':    'prev',
  'f6':    'next',
  'pause': 'ins',
  'del':   'scrlk',
});

/** Lookup a KeyPosition by token. */
const _byToken = new Map(KEY_POSITIONS.map(k => [k.token, k]));
export function getKeyByToken(token) {
  return _byToken.get(token.toLowerCase()) || null;
}
