<script setup lang="ts">
const { tm, rt } = useI18n()
const cols = ['education', 'experience'] as const
const list = (k: string) => (tm(`journey.${k}_items`) as any[]).map((i) => ({ period: rt(i.period), title: rt(i.title), place: rt(i.place), text: rt(i.text) }))
</script>

<template>
  <section id="journey" data-section aria-labelledby="journey-h" class="border-t border-hairline px-gutter py-section">
    <div class="mx-auto max-w-stage">
      <h2 id="journey-h" data-reveal-lines class="font-serif text-display break-words hyphens-auto">{{ $t('journey.heading') }}</h2>
      <div class="mt-16 grid gap-16 md:grid-cols-2">
        <div v-for="c in cols" :key="c" class="min-w-0">
          <h3 data-reveal class="text-small uppercase text-accent">{{ $t(`journey.${c}`) }}</h3>
          <div class="relative mt-8 pl-8">
            <span aria-hidden="true" data-timeline-line class="absolute bottom-0 left-0 top-0 w-px origin-top bg-hairline"></span>
            <ol class="space-y-10">
              <li v-for="i in list(c)" :key="i.title" data-reveal class="min-w-0">
                <p class="text-small uppercase text-bone-muted">{{ i.period }}</p>
                <h4 class="mt-1 font-serif text-xl break-words hyphens-auto">{{ i.title }}</h4>
                <p class="text-bone-muted break-words">{{ i.place }}</p>
                <p class="mt-2 text-bone-muted break-words hyphens-auto">{{ i.text }}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
