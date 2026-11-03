// Easter eggs: key sequences (via useSecrets), and 7 wordmark clicks in 4s.
export default defineNuxtPlugin((nuxtApp) => {
  const { load } = useTheme()
  const { feed, found, progress } = useSecrets()
  nuxtApp.hook('app:mounted', load)
  let clicks: number[] = []

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
    if (!(e.target as HTMLElement | null)?.closest?.('[data-secret="wordmark"]')) return
    const now = Date.now()
    clicks = [...clicks, now].filter(c => now - c <= 4000)
    if (clicks.length >= 7) { clicks = []; found('synthwave') }
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
