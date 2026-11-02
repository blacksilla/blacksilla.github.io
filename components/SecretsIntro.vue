<script setup lang="ts">
// First-visit card: tells people the site has hidden themes and shows the riddles.
const { t } = useI18n()
const { unlocked } = useTheme()
const KEY = 'secrets-intro-seen'
const show = ref(false)
const locked = computed(() => THEMES.filter(id => !unlocked.value.includes(id)))

function close() {
  show.value = false
  try { localStorage.setItem(KEY, '1') } catch { /* storage blocked */ }
}

onMounted(() => {
  let seen = false
  try { seen = !!localStorage.getItem(KEY) } catch { /* storage blocked: show it */ }
  if (!seen) setTimeout(() => { if (locked.value.length) show.value = true }, 3000)
})
</script>

<template>
  <Transition enter-active-class="transition duration-[1400ms] ease-suave" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition duration-700 ease-suave" leave-to-class="translate-y-4 opacity-0">
    <aside v-if="show" role="region" :aria-label="t('themes.intro.title')" class="fixed bottom-6 right-6 z-50 w-[min(26rem,calc(100vw-3rem))] border border-hairline bg-ink-soft p-6 shadow-none">
      <p class="font-serif text-2xl">{{ t('themes.intro.title') }}</p>
      <p class="mt-3 text-small text-bone-muted">{{ t('themes.intro.body') }}</p>
      <ul class="mt-4 space-y-2 text-small">
        <li v-for="id in locked" :key="id" class="flex gap-3">
          <span aria-hidden="true" class="text-accent">?</span><span>{{ t(`themes.hints.${id}`) }}</span>
        </li>
      </ul>
      <button type="button" data-cursor-hover class="mt-5 border-b border-accent text-small uppercase text-accent" @click="close">{{ t('themes.intro.close') }}</button>
    </aside>
  </Transition>
</template>
