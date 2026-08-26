export type ThemeChoice = 'system' | 'dark' | 'light'

export interface AccentChoice {
  name: string
  h: number
  s: number
  l: number
  hex?: string
}

export interface Preferences {
  theme: ThemeChoice
  accent: AccentChoice
  glass: number
  includeExplicit: boolean
}

export const accents: AccentChoice[] = [
  { name: 'Iris', h: 250, s: 72, l: 74 },
  { name: 'Blue', h: 212, s: 88, l: 66 },
  { name: 'Teal', h: 174, s: 62, l: 52 },
  { name: 'Green', h: 150, s: 56, l: 56 },
  { name: 'Amber', h: 38, s: 92, l: 62 },
  { name: 'Rose', h: 344, s: 78, l: 68 },
  { name: 'Graphite', h: 222, s: 12, l: 64 },
]

const KEY = 'tongue-cheek-preferences'
const fallback: Preferences = { theme: 'system', accent: accents[5], glass: 72, includeExplicit: false }

export function loadPreferences(): Preferences {
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return fallback
  }
}

export function applyPreferences(preferences: Preferences): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = preferences.theme === 'system' ? (prefersDark ? 'dark' : 'light') : preferences.theme
  const root = document.documentElement
  root.dataset.theme = theme
  const lightness = theme === 'light' ? Math.max(38, preferences.accent.l - 18) : preferences.accent.l
  const saturation = theme === 'light' ? Math.min(96, preferences.accent.s + 8) : preferences.accent.s
  root.style.setProperty('--accent-h', `${preferences.accent.h}`)
  root.style.setProperty('--accent-s', `${saturation}%`)
  root.style.setProperty('--accent-l', `${lightness}%`)
  const glass = glassValues(preferences.glass)
  root.style.setProperty('--glass-a', glass.alpha.toFixed(3))
  root.style.setProperty('--glass-blur', `${glass.blur.toFixed(1)}px`)
  localStorage.setItem(KEY, JSON.stringify(preferences))
}

export function glassValues(value: number): { alpha: number; blur: number } {
  const ratio = Math.max(0, Math.min(100, value)) / 100
  return { alpha: 0.72 - ratio * 0.68, blur: 30 - ratio * 24 }
}

export function hexToAccent(hex: string): AccentChoice {
  const normal = hex.replace('#', '')
  const r = parseInt(normal.slice(0, 2), 16) / 255
  const g = parseInt(normal.slice(2, 4), 16) / 255
  const b = parseInt(normal.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (delta) {
    if (max === r) h = 60 * (((g - b) / delta) % 6)
    else if (max === g) h = 60 * ((b - r) / delta + 2)
    else h = 60 * ((r - g) / delta + 4)
  }
  if (h < 0) h += 360
  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  return { name: 'Custom', h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100), hex }
}
