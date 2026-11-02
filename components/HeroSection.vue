<script setup lang="ts">
// Deterministic waveform lines (SSR-safe: no Math.random).
const lines = Array.from({ length: 28 }, (_, k) => {
  const amp = 40 + (k % 7) * 14
  const ph = k * 0.45
  let d = ''
  for (let x = 0; x <= 1000; x += 10) {
    const env = Math.sin((x / 1000) * Math.PI)
    const y = 200 + Math.sin(x / 38 + ph) * amp * env * Math.cos(x / 130 + k * 0.2)
    d += `${x ? 'L' : 'M'}${x} ${y.toFixed(1)}`
  }
  return { d, o: 0.25 + (k % 5) * 0.12 }
})
const noPortrait = ref(false)
</script>

<template>
  <section id="top" data-section class="relative flex min-h-[100svh] items-end overflow-hidden px-gutter pb-16 pt-32 md:pb-24">
    <svg aria-hidden="true" viewBox="0 0 1000 400" preserveAspectRatio="none" class="pointer-events-none absolute inset-x-0 top-1/2 h-[70%] w-full -translate-y-1/2 text-accent">
      <path v-for="(l, i) in lines" :key="i" data-wave :d="l.d" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" :opacity="l.o * 0.35" />
    </svg>
    <div aria-hidden="true" data-parallax="0.1" class="pointer-events-none absolute right-[8%] top-[12%] h-[40vmin] w-[40vmin] rounded-full border border-hairline"></div>
    <div aria-hidden="true" data-parallax="0.2" class="pointer-events-none absolute right-[22%] top-[30%] h-[18vmin] w-[18vmin] rounded-full border border-hairline"></div>
    <div aria-hidden="true" data-parallax="0.05" class="pointer-events-none absolute inset-y-0 left-[12%] w-px bg-hairline"></div>

    <div class="relative mx-auto grid w-full max-w-stage items-end gap-10 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-8">
        <p data-reveal class="mb-6 text-small uppercase text-accent">{{ $t('hero.role') }}</p>
        <h1 data-reveal-lines class="w-min max-w-full font-serif text-mega">{{ $t('hero.name') }}</h1>
        <div class="mt-10 flex flex-wrap items-end justify-between gap-6 lg:max-w-2xl">
          <p data-reveal class="max-w-md text-bone-muted">{{ $t('hero.pitch') }}</p>
          <a href="#about" data-reveal data-cursor-hover class="text-small uppercase text-bone-muted hover:text-bone">{{ $t('hero.scroll') }}</a>
        </div>
      </div>
      <div data-portrait class="relative hidden aspect-[4/5] w-full max-w-md justify-self-end overflow-hidden border border-hairline lg:col-span-4 lg:block">
        <img v-if="!noPortrait" src="/images/portrait.webp" width="900" height="1350" loading="lazy" decoding="async" :alt="$t('hero.name')" class="absolute inset-0 h-full w-full object-cover" @error="noPortrait = true" />
        <div v-else aria-hidden="true" class="absolute inset-0 flex items-center justify-center bg-ink-soft">
          <span class="font-serif text-[8rem] italic text-bone/15">AS</span>
        </div>
      </div>
    </div>
  </section>
</template>
