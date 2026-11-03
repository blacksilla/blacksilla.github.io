<script setup lang="ts">
const { current, unlocked, toast, set } = useTheme()
const { consoleOpen, progress } = useSecrets()
const { t } = useI18n()
const open = (id: ThemeId) => unlocked.value.includes(id)
// The swatch that was hovered, focused or tapped: its name or riddle shows in the caption (works on touch too).
const active = ref<ThemeId | null>(null)
const hidden = computed(() => THEMES.filter(id => !unlocked.value.includes(id)).length)
const caption = computed(() => {
  if (!active.value) return hidden.value ? t('themes.idle', { count: hidden.value }) : t('themes.allDone')
  if (open(active.value)) return t(`themes.names.${active.value}`)
  return `${t(`themes.kind.${THEME_KIND[active.value]}`)}. ${t(`themes.hints.${active.value}`)}`
})
const label = (id: ThemeId) => open(id) ? t(`themes.names.${id}`) : `${t('themes.locked')}: ${t(`themes.hints.${id}`)}`
</script>

<template>
  <div class="w-[min(100%,25rem)]">
    <p class="mb-3 text-small uppercase text-bone-muted">{{ $t('themes.heading') }}</p>
    <ul class="flex flex-wrap items-center gap-3" @mouseleave="active = null">
      <li v-for="id in THEMES" :key="id">
        <!-- The button uses the page's own colours; only the inner dot is scoped with data-theme to show that theme's palette. -->
        <button
          v-if="open(id)"
          type="button"
          data-cursor-hover
          class="flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-colors duration-200 hover:border-bone-muted aria-pressed:border-bone"
          :aria-pressed="current === id"
          :aria-label="label(id)"
          @click="set(id); active = id" @mouseenter="active = id" @focus="active = id" @blur="active = null"
        >
          <span :data-theme="id" class="block h-6 w-6 rounded-full" style="background: linear-gradient(135deg, rgb(var(--c-ink)) 50%, rgb(var(--c-accent)) 50%); box-shadow: inset 0 0 0 1px rgb(var(--c-bone) / 0.25)"></span>
        </button>
        <button
          v-else
          type="button"
          data-cursor-hover
          class="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-hairline text-small text-bone-muted transition-colors duration-200 hover:border-accent hover:text-accent"
          :aria-label="label(id)"
          @click="active = id" @mouseenter="active = id" @focus="active = id" @blur="active = null"
        >?</button>
      </li>
      <li>
        <button type="button" data-cursor-hover class="flex h-10 w-10 items-center justify-center rounded-full border border-hairline font-mono text-small text-bone-muted transition-colors duration-200 hover:border-accent hover:text-accent" :aria-label="$t('themes.console.open')" :title="$t('themes.console.open')" @click="consoleOpen = true">&gt;_</button>
      </li>
    </ul>
    <p aria-live="polite" class="mt-3 min-h-[4.5em] text-small text-bone-muted">{{ caption }}</p>
    <CodeConsole />
    <div aria-live="polite" class="pointer-events-none fixed bottom-16 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 text-small text-bone-muted">
      <template v-if="progress.visible">
        <span>{{ $t('themes.console.typing') }}</span>
        <span aria-hidden="true" class="flex gap-1"><i v-for="n in progress.total" :key="n" class="block h-1.5 w-1.5 rounded-full border border-bone-muted" :class="n <= progress.matched ? 'bg-accent border-accent' : ''"></i></span>
      </template>
    </div>
    <div aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <p v-if="toast" class="rounded-full border border-hairline bg-ink-soft px-5 py-2 text-small text-bone">
        {{ $t('themes.toast', { name: $t(`themes.names.${toast}`) }) }}
      </p>
    </div>
  </div>
</template>
