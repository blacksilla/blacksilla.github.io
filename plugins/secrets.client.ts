// Easter eggs: key sequences, and 7 wordmark clicks in 4s. Matching lives in composables/useTheme.ts.
export default defineNuxtPlugin((nuxtApp) => {
  const { unlock, toast, load } = useTheme()
  nuxtApp.hook('app:mounted', load)
  let buffer = ''
  let clicks: number[] = []
  let timer: ReturnType<typeof setTimeout>

  const found = (id: ThemeId) => {
    unlock(id)
    toast.value = id
    clearTimeout(timer)
    timer = setTimeout(() => { toast.value = null }, 4000)
  }

  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const k = e.key.startsWith('Arrow') ? e.key[5]! : e.key.length === 1 ? e.key.toLowerCase() : ''
    if (!k) return
    buffer = (buffer + k).slice(-16)
    // Arrows mid-sequence (after 2+ in a row) shouldn't scroll the page.
    if (/^[UDLR]$/.test(k) && /(UU|UUD|UUDD|UUDDL|UUDDLR|UUDDLRL|UUDDLRLR)$/.test(buffer)) e.preventDefault()
    const id = matchSecret(buffer)
    if (id) { buffer = ''; found(id) }
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
