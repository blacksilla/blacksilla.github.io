<script setup lang="ts">
const { t, tm, rt } = useI18n()
// Project names are proper nouns: never translated, same order as projects.items in the locales.
// null = unnamed project, shown with its translated descriptive `title` instead.
const NAMES = [null, 'Highfield Studio', 'PocketMix']
const items = computed(() => (tm('projects.items') as any[]).map((p, i) => ({
  name: NAMES[i] ?? rt(p.title), summary: rt(p.summary), status: rt(p.status),
  url: p.url ? rt(p.url) : '', stack: (p.stack || []).map((s: any) => rt(s)),
})))
const lead = items
const IMAGES: Record<string, string> = { 'Highfield Studio': '/images/projects/highfield.jpg' }
// Abstract in-theme art (currentColor only) for projects without a real image.
const fader = [0.3, 0.7, 0.45, 0.85, 0.2, 0.6]
</script>

<template>
  <section id="projects" data-section aria-labelledby="projects-h" class="border-t border-hairline px-gutter py-section">
    <div class="mx-auto max-w-stage">
      <h2 id="projects-h" data-reveal-lines class="font-serif text-display break-words hyphens-auto">{{ t('projects.heading') }}</h2>
      <p data-reveal class="mt-6 max-w-xl text-bone-muted 2xl:max-w-3xl 2xl:text-xl">{{ t('projects.intro') }}</p>

      <ul class="mt-20 space-y-24 md:space-y-0">
        <li v-for="(p, i) in lead" :key="p.name" data-panel data-cursor-hover class="grid items-center gap-8 border-t border-hairline py-12 md:min-h-[85svh] md:grid-cols-12 md:gap-16">
          <div class="min-w-0 md:col-span-7" :class="i % 2 ? 'md:order-2' : ''">
            <div class="relative aspect-[16/11] overflow-hidden border border-hairline bg-ink-soft">
              <img v-if="IMAGES[p.name]" data-parallax-img :src="IMAGES[p.name]" :alt="p.name" class="absolute -inset-[6%] h-[112%] w-[112%] max-w-none object-cover" loading="lazy" />
              <div v-else data-parallax-img role="img" :aria-label="p.name" class="absolute inset-0 flex items-center justify-center text-accent">
                <svg v-if="i === 2" viewBox="0 0 400 260" class="h-full w-full" fill="none" stroke="currentColor" aria-hidden="true">
                  <g v-for="(v, k) in fader" :key="k" :transform="`translate(${50 + k * 60} 0)`">
                    <line x1="0" y1="40" x2="0" y2="220" stroke-width="1" opacity="0.35" />
                    <rect x="-12" :y="40 + (1 - v) * 150" width="24" height="30" stroke-width="1.5" fill="currentColor" fill-opacity="0.15" />
                  </g>
                  <path d="M20 20 Q80 -10 140 20 T260 20 T380 20" stroke-width="1" opacity="0.5" />
                </svg>
                <svg v-else viewBox="0 0 400 260" class="h-full w-full" fill="none" stroke="currentColor" aria-hidden="true">
                  <path d="M40 40H360V220H40ZM40 90H360M150 90V220M260 90V150" stroke-width="1" opacity="0.5" />
                  <rect x="56" y="50" width="70" height="26" stroke-width="1.5" fill="currentColor" fill-opacity="0.2" />
                  <rect x="165" y="105" width="80" height="30" stroke-width="1" opacity="0.6" />
                  <rect x="275" y="165" width="70" height="40" stroke-width="1" opacity="0.6" />
                </svg>
              </div>
            </div>
          </div>
          <div class="min-w-0 md:col-span-5" :class="i % 2 ? 'md:order-1' : ''">
            <p aria-hidden="true" class="font-serif text-[clamp(5rem,12vw,12rem)] italic leading-none text-accent/80">0{{ i + 1 }}</p>
            <p class="mt-4 text-small uppercase text-accent">{{ t(`projects.status.${p.status}`) }}</p>
            <h3 class="mt-3 font-serif text-h2 break-words hyphens-auto">{{ p.name }}</h3>
            <p class="mt-4 text-bone-muted break-words hyphens-auto 2xl:text-xl">{{ p.summary }}</p>
            <p v-if="p.stack.length" class="mt-4 text-small uppercase text-bone-muted">{{ p.stack.join(' / ') }}</p>
            <a v-if="p.url" data-cursor-hover :href="p.url" target="_blank" rel="noopener noreferrer" class="mt-6 inline-block border-b border-accent text-accent">{{ t('projects.visit') }}<span class="sr-only"> - {{ p.name }}</span></a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
