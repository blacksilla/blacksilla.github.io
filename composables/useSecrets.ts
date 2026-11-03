// Shared secret-code engine: the window keydown plugin and the on-screen console both feed it.
// Keys are normalised to one char: letters lowercase, arrows U/D/L/R.
let buffer = ''
let resetTimer: ReturnType<typeof setTimeout>
let toastTimer: ReturnType<typeof setTimeout>
let hideTimer: ReturnType<typeof setTimeout>

export const prefixOf = (buf: string) => {
  for (let n = Math.min(buf.length, 12); n >= 2; n--) {
    const tail = buf.slice(-n)
    const hit = SECRETS.find(([code]) => code.length > n && code.startsWith(tail))
    if (hit) return { len: n, total: hit[0].length }
  }
  return null
}

export function useSecrets() {
  const { unlock, toast } = useTheme()
  // matched = chars matched so far, total = length of target code, visible = indicator shown
  const progress = useState('secrets-progress', () => ({ matched: 0, total: 0, visible: false }))

  const consoleOpen = useState('secrets-console-open', () => false)
  // Which theme's animation is playing (SecretBurst.vue); n changes on every play so it restarts.
  const burst = useState<{ id: ThemeId, n: number } | null>('secrets-burst', () => null)
  const play = (id: ThemeId) => { if (id !== 'ember') burst.value = { id, n: Date.now() } }
  const clear =() => { buffer = ''; progress.value = { matched: 0, total: 0, visible: false } }

  function found(id: ThemeId) {
    clear()
    unlock(id)
    play(id)
    toast.value = id
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { toast.value = null }, 4000)
  }

  // Returns true when the key completed a code.
  function feed(k: string) {
    buffer = (buffer + k).slice(-16)
    clearTimeout(resetTimer)
    resetTimer = setTimeout(clear, 4000)
    const id = matchSecret(buffer)
    if (id) { found(id); return true }
    const p = prefixOf(buffer)
    clearTimeout(hideTimer)
    if (p) {
      progress.value = { matched: p.len, total: p.total, visible: true }
      hideTimer = setTimeout(() => { progress.value = { ...progress.value, visible: false } }, 1500)
    } else progress.value = { matched: 0, total: 0, visible: false }
    return false
  }

  // Typed word from the console. Returns true if it unlocked something.
  function submit(text: string) {
    const id = matchSecret(text.trim().toLowerCase())
    if (id) found(id)
    return !!id
  }

  return { feed, submit, found, play, burst, progress, consoleOpen }
}
