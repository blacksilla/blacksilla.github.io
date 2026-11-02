<script setup lang="ts">
const { current, unlocked, toast, set } = useTheme()
const { t } = useI18n()
// [background, accent] preview dot per theme
const dots: Record<ThemeId, [string, string]> = {
  ember: ['#0f0e0d', '#c4a77d'],
  kanto: ['#1a1a2e', '#e63946'],
  saiyan: ['#14213d', '#fca311'],
  matrix: ['#020a03', '#00ff41'],
  synthwave: ['#1a0b2e', '#ff2e97'],
  gameboy: ['#0f380f', '#9bbc0f'],
}
const open = (id: ThemeId) => unlocked.value.includes(id)
const label = (id: ThemeId) => open(id)
  ? t(`themes.names.${id}`)
  : `${t('themes.locked')}: ${t(`themes.hints.${id}`)}`
</script>

<template>
  <div>
    <p class="mb-3 text-small text-bone-muted">{{ $t('themes.heading') }}</p>
    <ul class="flex gap-3">
      <li v-for="id in THEMES" :key="id" class="group relative">
        <button
          v-if="open(id)"
          type="button"
          class="block h-6 w-6 rounded-full border border-hairline outline-offset-4 transition-transform hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-accent aria-pressed:ring-offset-2 aria-pressed:ring-offset-ink"
          :style="{ background: `linear-gradient(135deg, ${dots[id][0]} 50%, ${dots[id][1]} 50%)` }"
          :aria-pressed="current === id"
          :aria-label="label(id)"
          @click="set(id)"
        />
        <button
          v-else
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-full border border-hairline text-[0.7rem] text-bone-muted opacity-50 outline-offset-4"
          :aria-label="label(id)"
        >?</button>
        <span aria-hidden="true" class="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap text-small text-bone group-hover:block group-focus-within:block">
          {{ open(id) ? $t(`themes.names.${id}`) : $t(`themes.hints.${id}`) }}
        </span>
      </li>
    </ul>
    <div aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <p v-if="toast" class="rounded-full border border-hairline bg-ink-soft px-5 py-2 text-small text-bone">
        {{ $t('themes.toast', { name: $t(`themes.names.${toast}`) }) }}
      </p>
    </div>
  </div>
</template>
