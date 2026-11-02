<script setup lang="ts">
const { tm, rt } = useI18n()
const items = computed(() => (tm('stack.items') as any[]).map((s) => ({ name: rt(s.name), use: rt(s.use) })))
</script>

<template>
  <section id="stack" data-section aria-labelledby="stack-h" class="border-t border-hairline px-gutter py-section">
    <div class="mx-auto max-w-stage">
      <h2 id="stack-h" data-reveal-lines class="font-serif text-display break-words hyphens-auto">{{ $t('stack.heading') }}</h2>
      <ul class="mt-16 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="s in items" :key="s.name" data-reveal class="min-w-0 border-t border-hairline py-6">
          <h3 class="font-serif text-xl break-words">{{ s.name }}</h3>
          <p class="mt-2 text-bone-muted break-words hyphens-auto">{{ s.use }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
