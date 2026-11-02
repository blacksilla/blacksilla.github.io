export const THEMES = ['ember', 'kanto', 'saiyan', 'matrix', 'synthwave', 'gameboy'] as const
export type ThemeId = typeof THEMES[number]
export const THEME_KEY = 'theme'
export const UNLOCKED_KEY = 'themes-unlocked'

// Keys are normalised to one char each: letters lowercase, arrows U/D/L/R (see secrets.client.ts).
// Synthwave is unlocked by the wordmark click streak, not here.
export const SECRETS: Array<[string, ThemeId]> = [
  ['UUDDLRLRba', 'gameboy'],
  ['pikachu', 'kanto'], ['kanto', 'kanto'],
  ['kamehameha', 'saiyan'], ['saiyan', 'saiyan'],
  ['neo', 'matrix'], ['matrix', 'matrix'],
]
export const matchSecret = (buffer: string): ThemeId | null =>
  SECRETS.find(([code]) => buffer.endsWith(code))?.[1] ?? null

const read = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* storage blocked */ } }
const isTheme = (v: unknown): v is ThemeId => THEMES.includes(v as ThemeId)

export function useTheme() {
  const current = useState<ThemeId>('theme-current', () => 'ember')
  const unlocked = useState<ThemeId[]>('theme-unlocked', () => ['ember'])
  const toast = useState<ThemeId | null>('theme-toast', () => null)

  // Called after hydration (app:mounted) so SSR markup and first client render match.
  const loaded = useState('theme-loaded', () => false)
  function load() {
    if (loaded.value) return
    loaded.value = true
    try {
      const list = (JSON.parse(read(UNLOCKED_KEY) || '[]') as unknown[]).filter(isTheme)
      unlocked.value = Array.from(new Set<ThemeId>(['ember', ...list]))
    } catch { /* corrupt value: keep default */ }
    const saved = read(THEME_KEY)
    if (isTheme(saved) && unlocked.value.includes(saved)) {
      current.value = saved
      document.documentElement.dataset.theme = saved
    }
  }

  function set(id: ThemeId) {
    if (!unlocked.value.includes(id)) return
    current.value = id
    write(THEME_KEY, id)
    if (import.meta.client) document.documentElement.dataset.theme = id
  }

  function unlock(id: ThemeId) {
    const isNew = !unlocked.value.includes(id)
    if (isNew) {
      unlocked.value = [...unlocked.value, id]
      write(UNLOCKED_KEY, JSON.stringify(unlocked.value))
    }
    set(id)
    return isNew
  }

  return { current, unlocked, toast, unlock, set, load }
}
