export const ASPECT_DESCRIPTIONS: Record<string, { angle: string; description: string }> = {
  'Conjunction':    { angle: '0°',   description: 'Planets fuse into one intensified force — their themes merge and amplify each other.' },
  'Sextile':        { angle: '60°',  description: 'A cooperative flow of creative opportunity. Energies that stimulate and support each other.' },
  'Square':         { angle: '90°',  description: 'Productive tension that demands action. Friction that drives growth and decisive change.' },
  'Trine':          { angle: '120°', description: 'Natural affinity and effortless flow — innate talents that work together without strain.' },
  'Opposition':     { angle: '180°', description: 'Polarity seeking balance. Complementary forces that illuminate each other across the sky.' },
  'Semi-sextile':   { angle: '30°',  description: 'Subtle friction between neighboring signs, nudging toward adjustment and awareness.' },
  'Semi-square':    { angle: '45°',  description: 'A minor stressor — persistent tension that motivates when channeled constructively.' },
  'Quintile':       { angle: '72°',  description: 'A rare creative spark. Planets linked by this angle share a talent for inspired invention.' },
  'Sesquiquadrate': { angle: '135°', description: 'Agitation seeking release. Restless energy that can catalyze breakthroughs under pressure.' },
  'Biquintile':     { angle: '144°', description: 'Refined creative mastery — the fluency that comes from developed and practiced talent.' },
  'Quincunx':       { angle: '150°', description: 'An awkward link between incompatible sign energies. Constant recalibration is required.' },
}

export const PATTERN_DESCRIPTIONS: Record<string, string> = {
  'Grand Trine':       'Three planets in mutual 120° trine form a self-contained triangle of ease — a reservoir of talent that flows naturally, though it may need challenge to fully engage.',
  'Grand Cross':       'Four planets forming two oppositions and four squares — a crucible of tension from all directions, forging strength and resilience through sustained effort.',
  'T-Square':          'An opposition with a third planet at the square point — a driven triangle of conflict and resolution, channeling tension toward a focal purpose.',
  'Yod':               'Two planets in sextile both pointing via quincunx to a third — a "Finger of God" configuration associated with a specific, fated life calling.',
  'Stellium':          'Three or more planets clustered together — an intense concentration of energy amplifying a single theme, sign, or area of life.',
  'Kite':              'A Grand Trine with an opposing planet creating a focal point — natural gifts made purposeful and given direction.',
  'Mystic Rectangle':  'Two sextiles, two trines, and two oppositions — a stable pattern integrating ease with polarity into creative, grounded tension.',
}

/** Extract the pattern type name from a full pattern string like "Grand Trine: ♀ △ ♃ △ ♄" */
export function patternTypeName(patternString: string): string {
  return patternString.split(':')[0]?.trim() ?? patternString
}
