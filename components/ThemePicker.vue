<script setup lang="ts">
const { current, unlocked, toast, set } = useTheme()
const { t } = useI18n()
const open = (id: ThemeId) => unlocked.value.includes(id)
// The swatch that was hovered, focused or tapped: its name or riddle shows in the caption (works on touch too).
const active = ref<ThemeId | null>(null)
const caption = computed(() => {
  if (!active.value) return t('themes.idle')
  return open(active.value) ? t(`themes.names.${active.value}`) : t(`themes.hints.${active.value}`)
})
const label = (id: ThemeId) => open(id) ? t(`themes.names.${id}`) : `${t('themes.locked')}: ${t(`themes.hints.${id}`)}`
</script>

<template>
  <div class="max-w-md">
    <p class="mb-3 text-small uppercase text-bone-muted">{{ $t('themes.heading') }}</p>
    <ul class="flex gap-4" @mouseleave="active = null">
      <li v-for="id in THEMES" :key="id">
        <!-- data-theme scopes the real theme variables, so swatches always match the theme -->
        <button
          v-if="open(id)"
          type="button"
          :data-theme="id"
          class="block h-8 w-8 rounded-full border border-hairline outline-offset-4 transition-transform hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-bone aria-pressed:ring-offset-2 aria-pressed:ring-offset-ink"
          style="background: linear-gradient(135deg, rgb(var(--c-ink)) 50%, rgb(var(--c-accent)) 50%)"
          :aria-pressed="current === id"
          :aria-label="label(id)"
          @click="set(id); active = id" @mouseenter="active = id" @focus="active = id" @blur="active = null"
        />
        <button
          v-else
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-small text-bone-muted outline-offset-4 hover:border-accent hover:text-accent"
          :aria-label="label(id)"
          @click="active = id" @mouseenter="active = id" @focus="active = id" @blur="active = null"
        >?</button>
      </li>
    </ul>
    <p aria-live="polite" class="mt-3 min-h-[3em] text-small text-bone-muted">{{ caption }}</p>
    <div aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <p v-if="toast" class="rounded-full border border-hairline bg-ink-soft px-5 py-2 text-small text-bone">
        {{ $t('themes.toast', { name: $t(`themes.names.${toast}`) }) }}
      </p>
    </div>
  </div>
</template>
