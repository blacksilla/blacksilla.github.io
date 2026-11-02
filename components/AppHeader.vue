<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const items = ['about', 'projects', 'stack', 'journey', 'contact']
const langs = computed(() => (locales.value as any[]).map((l) => ({ code: l.code, name: l.name })))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-hairline bg-ink/90 backdrop-blur-sm">
    <div class="mx-auto flex max-w-stage flex-wrap items-center justify-between gap-x-8 gap-y-2 px-gutter py-4">
      <a href="#top" data-secret="wordmark" data-cursor-hover class="font-serif text-lg">{{ t('hero.name') }}</a>
      <nav :aria-label="t('nav.about')" class="order-3 w-full min-w-0 md:order-none md:w-auto">
        <ul class="flex flex-wrap gap-x-6 gap-y-1 text-small uppercase text-bone-muted">
          <li v-for="i in items" :key="i"><a :href="`#${i}`" data-cursor-hover class="break-words hover:text-bone">{{ t(`nav.${i}`) }}</a></li>
        </ul>
      </nav>
      <ul :aria-label="t('language.label')" class="flex gap-3 text-small uppercase">
        <li v-for="l in langs" :key="l.code">
          <a :href="switchLocalePath(l.code)" data-cursor-hover :lang="l.code" :hreflang="l.code" :title="l.name" :aria-label="`${l.code.toUpperCase()} – ${l.name}`"
            :aria-current="l.code === locale ? 'true' : undefined"
            :class="l.code === locale ? 'text-accent' : 'text-bone-muted hover:text-bone'">{{ l.code }}</a>
        </li>
      </ul>
    </div>
  </header>
</template>
