/**
 * Action Token Dictionary for the Kinesis Freestyle Edge RGB.
 * Source: Direct Programming Guide section 4.8 Action Token Dictionary.
 *
 * Each entry: { token, label, category }
 */

const ACTIONS_RAW = [
  // Letters
  { token: 'a', label: 'A', category: 'letter' },
  { token: 'b', label: 'B', category: 'letter' },
  { token: 'c', label: 'C', category: 'letter' },
  { token: 'd', label: 'D', category: 'letter' },
  { token: 'e', label: 'E', category: 'letter' },
  { token: 'f', label: 'F', category: 'letter' },
  { token: 'g', label: 'G', category: 'letter' },
  { token: 'h', label: 'H', category: 'letter' },
  { token: 'i', label: 'I', category: 'letter' },
  { token: 'j', label: 'J', category: 'letter' },
  { token: 'k', label: 'K', category: 'letter' },
  { token: 'l', label: 'L', category: 'letter' },
  { token: 'm', label: 'M', category: 'letter' },
  { token: 'n', label: 'N', category: 'letter' },
  { token: 'o', label: 'O', category: 'letter' },
  { token: 'p', label: 'P', category: 'letter' },
  { token: 'q', label: 'Q', category: 'letter' },
  { token: 'r', label: 'R', category: 'letter' },
  { token: 's', label: 'S', category: 'letter' },
  { token: 't', label: 'T', category: 'letter' },
  { token: 'u', label: 'U', category: 'letter' },
  { token: 'v', label: 'V', category: 'letter' },
  { token: 'w', label: 'W', category: 'letter' },
  { token: 'x', label: 'X', category: 'letter' },
  { token: 'y', label: 'Y', category: 'letter' },
  { token: 'z', label: 'Z', category: 'letter' },

  // Numbers
  { token: '1', label: '1', category: 'number' },
  { token: '2', label: '2', category: 'number' },
  { token: '3', label: '3', category: 'number' },
  { token: '4', label: '4', category: 'number' },
  { token: '5', label: '5', category: 'number' },
  { token: '6', label: '6', category: 'number' },
  { token: '7', label: '7', category: 'number' },
  { token: '8', label: '8', category: 'number' },
  { token: '9', label: '9', category: 'number' },
  { token: '0', label: '0', category: 'number' },

  // Function keys
  { token: 'f1',  label: 'F1',  category: 'function' },
  { token: 'f2',  label: 'F2',  category: 'function' },
  { token: 'f3',  label: 'F3',  category: 'function' },
  { token: 'f4',  label: 'F4',  category: 'function' },
  { token: 'f5',  label: 'F5',  category: 'function' },
  { token: 'f6',  label: 'F6',  category: 'function' },
  { token: 'f7',  label: 'F7',  category: 'function' },
  { token: 'f8',  label: 'F8',  category: 'function' },
  { token: 'f9',  label: 'F9',  category: 'function' },
  { token: 'f10', label: 'F10', category: 'function' },
  { token: 'f11', label: 'F11', category: 'function' },
  { token: 'f12', label: 'F12', category: 'function' },
  { token: 'f13', label: 'F13', category: 'function' },
  { token: 'f14', label: 'F14', category: 'function' },
  { token: 'f15', label: 'F15', category: 'function' },
  { token: 'f16', label: 'F16', category: 'function' },
  { token: 'f17', label: 'F17', category: 'function' },
  { token: 'f18', label: 'F18', category: 'function' },
  { token: 'f19', label: 'F19', category: 'function' },
  { token: 'f20', label: 'F20', category: 'function' },
  { token: 'f21', label: 'F21', category: 'function' },
  { token: 'f22', label: 'F22', category: 'function' },
  { token: 'f23', label: 'F23', category: 'function' },
  { token: 'f24', label: 'F24', category: 'function' },

  // Modifiers
  { token: 'lshft', label: 'Left Shift',   category: 'modifier' },
  { token: 'rshft', label: 'Right Shift',  category: 'modifier' },
  { token: 'lalt',  label: 'Left Alt',     category: 'modifier' },
  { token: 'ralt',  label: 'Right Alt',    category: 'modifier' },
  { token: 'lctrl', label: 'Left Ctrl',    category: 'modifier' },
  { token: 'rctrl', label: 'Right Ctrl',   category: 'modifier' },
  { token: 'lwin',  label: 'Left Windows', category: 'modifier' },
  { token: 'rwin',  label: 'Right Windows',category: 'modifier' },

  // Punctuation
  { token: 'hyph',  label: 'Hyphen',       category: 'punctuation' },
  { token: '=',     label: 'Equals',       category: 'punctuation' },
  { token: 'obrk',  label: 'Open Bracket', category: 'punctuation' },
  { token: 'cbrk',  label: 'Close Bracket',category: 'punctuation' },
  { token: 'com',   label: 'Comma',        category: 'punctuation' },
  { token: 'per',   label: 'Period',       category: 'punctuation' },
  { token: 'apos',  label: 'Apostrophe',   category: 'punctuation' },
  { token: 'tilde', label: 'Tilde',        category: 'punctuation' },
  { token: '/',     label: 'Forward Slash', category: 'punctuation' },
  { token: '\\',    label: 'Back Slash',   category: 'punctuation' },
  { token: 'colon', label: 'Colon',        category: 'punctuation' },

  // Navigation
  { token: 'lft',   label: 'Left Arrow',   category: 'navigation' },
  { token: 'rght',  label: 'Right Arrow',  category: 'navigation' },
  { token: 'up',    label: 'Up Arrow',     category: 'navigation' },
  { token: 'dwn',   label: 'Down Arrow',   category: 'navigation' },
  { token: 'home',  label: 'Home',         category: 'navigation' },
  { token: 'end',   label: 'End',          category: 'navigation' },
  { token: 'pup',   label: 'Page Up',      category: 'navigation' },
  { token: 'pdn',   label: 'Page Down',    category: 'navigation' },

  // Editing
  { token: 'ent',   label: 'Enter',        category: 'editing' },
  { token: 'tab',   label: 'Tab',          category: 'editing' },
  { token: 'spc',   label: 'Space',        category: 'editing' },
  { token: 'bspc',  label: 'Backspace',    category: 'editing' },
  { token: 'del',   label: 'Delete',       category: 'editing' },
  { token: 'esc',   label: 'Escape',       category: 'editing' },
  { token: 'prnt',  label: 'Print Screen', category: 'editing' },
  { token: 'pause', label: 'Pause',        category: 'editing' },
  { token: 'ins',   label: 'Insert',       category: 'editing' },

  // Media
  { token: 'mute',  label: 'Mute',         category: 'media' },
  { token: 'vol+',  label: 'Volume Up',    category: 'media' },
  { token: 'vol-',  label: 'Volume Down',  category: 'media' },
  { token: 'play',  label: 'Play/Pause',   category: 'media' },
  { token: 'next',  label: 'Next Track',   category: 'media' },
  { token: 'prev',  label: 'Previous Track',category: 'media' },

  // Mouse
  { token: 'lmous', label: 'Left Mouse',   category: 'mouse' },
  { token: 'rmous', label: 'Right Mouse',  category: 'mouse' },
  { token: 'mmous', label: 'Middle Mouse',  category: 'mouse' },
  { token: 'mous4', label: 'Mouse Button 4',category: 'mouse' },
  { token: 'mous5', label: 'Mouse Button 5',category: 'mouse' },

  // Keypad
  { token: 'numlk',   label: 'Num Lock',     category: 'keypad' },
  { token: 'kp1',     label: 'Keypad 1',     category: 'keypad' },
  { token: 'kp2',     label: 'Keypad 2',     category: 'keypad' },
  { token: 'kp3',     label: 'Keypad 3',     category: 'keypad' },
  { token: 'kp4',     label: 'Keypad 4',     category: 'keypad' },
  { token: 'kp5',     label: 'Keypad 5',     category: 'keypad' },
  { token: 'kp6',     label: 'Keypad 6',     category: 'keypad' },
  { token: 'kp7',     label: 'Keypad 7',     category: 'keypad' },
  { token: 'kp8',     label: 'Keypad 8',     category: 'keypad' },
  { token: 'kp9',     label: 'Keypad 9',     category: 'keypad' },
  { token: 'kp0',     label: 'Keypad 0',     category: 'keypad' },
  { token: 'kp+',     label: 'Keypad Plus',  category: 'keypad' },
  { token: 'kp-',     label: 'Keypad Minus', category: 'keypad' },
  { token: 'kpdiv',   label: 'Keypad Divide',category: 'keypad' },
  { token: 'kpmult',  label: 'Keypad Multiply',category: 'keypad' },
  { token: 'kp.',     label: 'Keypad Decimal',category: 'keypad' },
  { token: 'kpent',   label: 'Keypad Enter', category: 'keypad' },
  { token: '=mac',    label: 'Keypad Equals (Mac)',category: 'keypad' },

  // Lock keys
  { token: 'caps',  label: 'Caps Lock',    category: 'lock' },
  { token: 'scrlk', label: 'Scroll Lock',  category: 'lock' },

  // Special
  { token: 'fntog', label: 'Fn Toggle',    category: 'special' },
  { token: 'fnshf', label: 'Fn Shift',     category: 'special' },
  { token: 'menu',  label: 'Menu/App',     category: 'special' },
  { token: 'calc',  label: 'Calculator',   category: 'special' },
  { token: 'shtdn', label: 'Shutdown',     category: 'special' },
  { token: 'led',   label: 'LED Toggle',   category: 'special' },
  { token: 'null',  label: 'No Key Action',category: 'special' },
  { token: 'lyout', label: 'Toggle Layout',category: 'special' },

  // International
  { token: 'intl\\', label: 'International \\',category: 'international' },
  { token: 'intl1',  label: 'International 1', category: 'international' },
  { token: 'intl2',  label: 'International 2', category: 'international' },
  { token: 'intl3',  label: 'International 3', category: 'international' },
  { token: 'intl4',  label: 'International 4', category: 'international' },
  { token: 'intl5',  label: 'International 5', category: 'international' },
];

/** @type {ReadonlyMap<string, ActionToken>} keyed by lowercase token */
export const ACTION_TOKENS = Object.freeze(
  new Map(ACTIONS_RAW.map(a => [a.token.toLowerCase(), Object.freeze(a)]))
);

/** All unique category names in display order. */
export const ACTION_CATEGORIES = Object.freeze([
  'letter', 'number', 'function', 'modifier', 'punctuation',
  'navigation', 'editing', 'media', 'mouse', 'keypad',
  'lock', 'special', 'international',
]);

/** Get actions filtered by category. */
export function getActionsByCategory(category) {
  return ACTIONS_RAW.filter(a => a.category === category);
}

/** Check if a token is a valid action. */
export function isValidAction(token) {
  return ACTION_TOKENS.has(token.toLowerCase());
}
