<script setup lang="ts">
// First-visit nudge: a slim bar docked to the bottom edge (hero keeps clear padding there) that expands into the clue list on request.
const { t } = useI18n()
const { unlocked } = useTheme()
const { consoleOpen } = useSecrets()
const KEY = 'secrets-intro-seen'
const KIND: Partial<Record<ThemeId, string>> = { kanto: 'type', saiyan: 'type', matrix: 'type', synthwave: 'click', gameboy: 'keys' }
const show = ref(false)
const expanded = ref(false)
const locked = computed(() => THEMES.filter(id => !unlocked.value.includes(id)))

function seen() { try { localStorage.setItem(KEY, '1') } catch { /* storage blocked */ } }
function dismiss() { show.value = false; expanded.value = false; seen() }
function expand() { expanded.value = true; seen() }
function openConsole() { consoleOpen.value = true }

onMounted(() => {
  let done = false
  try { done = !!localStorage.getItem(KEY) } catch { /* storage blocked: show it */ }
  if (!done) setTimeout(() => { if (locked.value.length) show.value = true }, 3000)
})
</script>

<template>
  <Transition enter-active-class="transition duration-[1400ms] ease-suave motion-reduce:transition-none" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition duration-500 ease-suave motion-reduce:transition-none" leave-to-class="translate-y-4 opacity-0">
    <aside v-if="show && locked.length" role="region" :aria-label="t('themes.intro.title')" class="fixed bottom-0 z-50" :class="expanded ? 'right-4 max-sm:inset-x-0 max-sm:right-0' : 'inset-x-0'">
      <div v-if="!expanded" class="flex items-center justify-center gap-2 border-t border-hairline bg-ink-soft/95 text-small backdrop-blur-sm">
        <button type="button" data-cursor-hover class="flex min-h-9 items-center gap-2 px-3 text-bone max-sm:min-h-11" :aria-expanded="false" @click="expand">
          <span>{{ t('themes.intro.title') }}</span><span aria-hidden="true" class="text-accent">+</span>
        </button>
        <button type="button" data-cursor-hover class="flex h-9 w-9 items-center justify-center text-bone-muted hover:text-bone max-sm:h-11 max-sm:w-11" :aria-label="t('themes.console.close')" @click="dismiss">✕</button>
      </div>
      <div v-else class="max-h-[calc(100svh-6rem)] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto border border-hairline bg-ink-soft p-5 max-sm:max-h-[70svh] max-sm:w-full max-sm:border-x-0 max-sm:border-b-0">
        <p class="font-serif text-xl">{{ t('themes.intro.title') }}</p>
        <p class="mt-2 text-small text-bone-muted">{{ t('themes.intro.body') }}</p>
        <ul class="mt-4 space-y-3 text-small">
          <li v-for="id in locked" :key="id">
            <span class="block text-[0.7rem] uppercase tracking-wider text-accent">{{ t(`themes.kind.${KIND[id]}`) }}</span>
            <span>{{ t(`themes.hints.${id}`) }}</span>
          </li>
        </ul>
        <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button type="button" data-cursor-hover class="min-h-[40px] border border-accent px-4 text-small uppercase text-accent" @click="openConsole">{{ t('themes.console.open') }}</button>
          <button type="button" data-cursor-hover class="min-h-[40px] text-small uppercase text-bone-muted hover:text-bone" @click="dismiss">{{ t('themes.intro.close') }}</button>
        </div>
      </div>
    </aside>
  </Transition>
</template>
