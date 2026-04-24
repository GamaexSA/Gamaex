export const GX = {
  bg:         '#0A0F0D',
  card:       '#111916',
  elem:       '#1A2320',
  elemHi:     '#1f2a26',
  gold:       '#C9A84C',
  goldSoft:   'rgba(201,168,76,0.16)',
  goldBorder: 'rgba(201,168,76,0.3)',
  green:      '#2ECC71',
  greenSoft:  'rgba(46,204,113,0.15)',
  greenBorder:'rgba(46,204,113,0.4)',
  red:        '#E74C3C',
  redSoft:    'rgba(231,76,60,0.15)',
  redBorder:  'rgba(231,76,60,0.35)',
  orange:     '#F39C12',
  orangeSoft: 'rgba(243,156,18,0.18)',
  orangeBorder:'rgba(243,156,18,0.3)',
  text:       '#E8E6E1',
  dim:        '#8A8780',
  faint:      '#4A5350',
  border:     '#2A3330',
  borderSoft: '#1f2724',
  white:      '#ffffff',
} as const;

// legacy aliases for compatibility
export const colors = {
  bg: GX.bg, bg2: GX.card, bg3: GX.elem,
  gold: GX.gold, goldDim: GX.goldSoft, goldBorder: GX.goldBorder,
  green: GX.green, greenDim: GX.greenSoft,
  red: GX.red, redDim: GX.redSoft,
  orange: GX.orange,
  text: GX.text, textDim: GX.dim, textFaint: GX.faint,
  border: GX.border, white: GX.white,
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius  = { sm: 8, md: 10, lg: 12, xl: 16 } as const;
export const font    = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 24, xxxl: 28 } as const;
