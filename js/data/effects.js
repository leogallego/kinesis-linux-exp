/**
 * Lighting effect definitions for the Kinesis Freestyle Edge RGB.
 * Source: Direct Programming Guide section 5.2 Keyboard Level Effect Tokens.
 *
 * Each entry: { id, token, label, hasColor, hasSpeed, hasDirection, hasPerKeyColors, hasBaseColor }
 *   - token: the V-Drive file token (null for Freestyle which has no effect line)
 *   - hasColor: effect-level color parameter
 *   - hasSpeed: speed parameter [spd1]-[spd9]
 *   - hasDirection: direction parameter [dirup]/[dirdown]/[dirleft]/[dirright]
 *   - hasPerKeyColors: supports per-key RGB color assignments
 *   - hasBaseColor: supports a [mono] base color line (two-tone effects)
 */

/** @type {ReadonlyArray<EffectDefinition>} */
export const EFFECTS = Object.freeze([
  {
    id: 'freestyle', token: null,       label: 'Freestyle',
    hasColor: false, hasSpeed: false, hasDirection: false,
    hasPerKeyColors: true, hasBaseColor: false,
  },
  {
    id: 'mono',      token: 'mono',     label: 'Monochrome',
    hasColor: true,  hasSpeed: false, hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: false,
  },
  {
    id: 'breathe',   token: 'breathe',  label: 'Breathe',
    hasColor: false, hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: true,  hasBaseColor: false,
  },
  {
    id: 'spectrum',  token: 'spectrum', label: 'Spectrum',
    hasColor: false, hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: false,
  },
  {
    id: 'wave',      token: 'wave',     label: 'Wave',
    hasColor: false, hasSpeed: true,  hasDirection: true,
    hasPerKeyColors: false, hasBaseColor: false,
  },
  {
    id: 'reactive',  token: 'reactive', label: 'Reactive',
    hasColor: true,  hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: true,
  },
  {
    id: 'star',      token: 'star',     label: 'Starlight',
    hasColor: true,  hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: true,
  },
  {
    id: 'rebound',   token: 'rebound',  label: 'Rebound',
    hasColor: true,  hasSpeed: true,  hasDirection: true,
    hasPerKeyColors: false, hasBaseColor: true,
  },
  {
    id: 'loop',      token: 'loop',     label: 'Loop',
    hasColor: true,  hasSpeed: true,  hasDirection: true,
    hasPerKeyColors: false, hasBaseColor: true,
  },
  {
    id: 'pulse',     token: 'pulse',    label: 'Pulse',
    hasColor: false, hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: false,
  },
  {
    id: 'rain',      token: 'rain',     label: 'Rain',
    hasColor: true,  hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: true,
  },
  {
    id: 'fireball',  token: 'fireball', label: 'Fireball',
    hasColor: true,  hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: true,
  },
  {
    id: 'ripple',    token: 'ripple',   label: 'Ripple',
    hasColor: true,  hasSpeed: true,  hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: true,
  },
  {
    id: 'black',     token: 'black',    label: 'Pitch Black',
    hasColor: false, hasSpeed: false, hasDirection: false,
    hasPerKeyColors: false, hasBaseColor: false,
  },
]);

/** Look up an effect definition by its V-Drive token. */
const _byToken = new Map(EFFECTS.filter(e => e.token).map(e => [e.token, e]));

export function getEffectByToken(token) {
  return _byToken.get(token.toLowerCase()) || null;
}

/** Look up an effect definition by its id. */
const _byId = new Map(EFFECTS.map(e => [e.id, e]));

export function getEffectById(id) {
  return _byId.get(id) || null;
}

/** Speed tokens: [spd1] through [spd9] */
export const SPEED_TOKENS = Object.freeze(
  Array.from({ length: 9 }, (_, i) => `spd${i + 1}`)
);

/** Direction tokens */
export const DIRECTION_TOKENS = Object.freeze(['dirup', 'dirdown', 'dirleft', 'dirright']);
