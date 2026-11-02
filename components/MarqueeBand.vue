<script setup lang="ts">
const { tm, rt } = useI18n()
const names = computed(() => (tm('stack.items') as any[]).map((s) => rt(s.name)))
</script>

<template>
  <div data-marquee aria-hidden="true" class="overflow-hidden border-y border-hairline py-6 md:py-10">
    <div data-marquee-track class="flex w-max">
      <ul v-for="n in 2" :key="n" class="flex shrink-0 items-center">
        <li v-for="s in names" :key="s" class="flex items-center whitespace-nowrap font-serif text-display italic text-bone/15">
          <span class="px-[0.4em] before:content-[attr(data-text)]" :data-text="s"></span><span class="text-accent/60">&#10022;</span>
        </li>
      </ul>
    </div>
  </div>
</template>
