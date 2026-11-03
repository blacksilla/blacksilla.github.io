// Easter eggs: key sequences (via useSecrets), click streaks (7 on the wordmark, 5 on the footer ©) and a night visit.
export default defineNuxtPlugin((nuxtApp) => {
  const { load } = useTheme()
  const { feed, found, progress } = useSecrets()
  const { unlocked } = useTheme()
  nuxtApp.hook('app:mounted', () => {
    load()
    // Night owl: visiting between 00:00 and 04:59 local time unlocks 'midnight' (a touch-friendly secret).
    if (new Date().getHours() < 5 && !unlocked.value.includes('midnight')) setTimeout(() => found('midnight'), 2500)
  })
  // [selector value, clicks needed, window ms, theme]
  const STREAKS: Array<[string, number, number, ThemeId]> = [['wordmark', 7, 4000, 'synthwave'], ['copyright', 5, 3000, 'noir']]
  const clicks: Record<string, number[]> = {}

  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key === 'Enter') return // lets "...B A Enter" work
    const k = e.key.startsWith('Arrow') ? e.key[5]! : e.key.length === 1 ? e.key.toLowerCase() : ''
    if (!k) return
    feed(k)
    // Arrows mid-Konami (2+ matched) shouldn't scroll the page.
    if (/^[UDLR]$/.test(k) && progress.value.matched >= 2) e.preventDefault()
  }

  const onClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement | null)?.closest?.('[data-secret]') as HTMLElement | null | undefined
    const rule = STREAKS.find(([name]) => name === el?.dataset.secret)
    if (!rule) return
    const [name, need, win, id] = rule
    const now = Date.now()
    clicks[name] = [...(clicks[name] || []), now].filter(c => now - c <= win)
    if (clicks[name].length >= need) { clicks[name] = []; found(id) }
  }

  window.addEventListener('keydown', onKey)
  document.addEventListener('click', onClick)
  // The plugin lives as long as the app; cleanup only matters for HMR.
  import.meta.hot?.dispose(() => {
    window.removeEventListener('keydown', onKey)
    document.removeEventListener('click', onClick)
  })
  console.info('Psst... try the old cheat codes.')
})
