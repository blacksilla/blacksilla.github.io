<script setup lang="ts">
const { tm, rt } = useI18n()
const paras = computed(() => (tm('about.paragraphs') as any[]).map((p) => rt(p)))
</script>

<template>
  <section id="about" data-section aria-labelledby="about-h" class="border-t border-hairline px-gutter py-section">
    <div class="mx-auto max-w-stage grid gap-12 md:grid-cols-12">
      <h2 id="about-h" data-reveal-lines class="font-serif text-display min-w-0 break-words hyphens-auto md:col-span-5">{{ $t('about.heading') }}</h2>
      <div class="min-w-0 space-y-6 text-bone-muted md:col-span-6 md:col-start-7 2xl:text-xl">
        <p v-for="(p, i) in paras" :key="i" data-reveal class="break-words hyphens-auto">{{ p }}</p>
      </div>
    </div>
  </section>
</template>
