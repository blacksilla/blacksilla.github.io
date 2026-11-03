<script setup lang="ts">
// On-screen code entry: a text field for words, a pad for arrows/B/A (touch has no keyboard).
const { consoleOpen, submit, feed } = useSecrets()
const text = ref('')
const wrong = ref(false)
const input = ref<HTMLInputElement | null>(null)
let opener: HTMLElement | null = null

const PAD: Array<[string, string, string]> = [
  ['U', '↑', 'Up'], ['D', '↓', 'Down'], ['L', '←', 'Left'], ['R', '→', 'Right'], ['b', 'B', 'B'], ['a', 'A', 'A'],
]

function close() { consoleOpen.value = false }
function go() {
  if (!text.value.trim()) return
  if (submit(text.value)) close()
  else wrong.value = true
}
function pad(k: string) {
  wrong.value = false
  if (feed(k)) close()
}

const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))

watch(consoleOpen, async (v) => {
  if (v) window.addEventListener('keydown', onEsc)
  else window.removeEventListener('keydown', onEsc)
  if (v) {
    opener = document.activeElement as HTMLElement | null
    text.value = ''
    wrong.value = false
    await nextTick()
    input.value?.focus()
  } else {
    opener?.focus?.()
    opener = null
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="consoleOpen" class="fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 p-4 sm:items-center" @click.self="close">
      <div
        role="dialog" aria-modal="true" :aria-label="$t('themes.console.title')"
        class="max-h-[calc(100svh-2rem)] w-[min(24rem,100%)] overflow-y-auto border border-hairline bg-ink-soft p-5 text-bone"
      >
        <div class="flex items-center justify-between">
          <p class="font-serif text-xl">{{ $t('themes.console.title') }}</p>
          <button type="button" data-cursor-hover class="flex h-11 w-11 items-center justify-center text-bone-muted hover:text-bone" :aria-label="$t('themes.console.close')" @click="close">✕</button>
        </div>
        <form class="mt-3 flex gap-2" @submit.prevent="go">
          <input
            ref="input" v-model="text" type="text" enterkeyhint="go"
            autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
            :placeholder="$t('themes.console.placeholder')" :aria-label="$t('themes.console.placeholder')"
            class="min-w-0 flex-1 border border-hairline bg-transparent px-3 py-2 text-[16px] text-bone placeholder:text-bone-muted focus:border-accent focus:outline-none"
            @input="wrong = false"
          />
          <button type="submit" data-cursor-hover class="min-h-[44px] border border-accent px-4 text-small uppercase text-accent">{{ $t('themes.console.submit') }}</button>
        </form>
        <p aria-live="polite" class="mt-2 min-h-[1.5em] text-small text-bone-muted">{{ wrong ? $t('themes.console.wrong') : '' }}</p>
        <p class="mt-3 text-small uppercase text-bone-muted">{{ $t('themes.console.pad') }}</p>
        <div class="mt-2 grid grid-cols-3 gap-2 min-[380px]:grid-cols-6">
          <button
            v-for="[k, sym, name] in PAD" :key="k" type="button" data-cursor-hover :aria-label="name"
            class="flex h-11 min-w-[44px] items-center justify-center border border-hairline text-lg hover:border-accent hover:text-accent active:border-accent"
            @click="pad(k)"
          >{{ sym }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
