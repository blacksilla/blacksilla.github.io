<script setup lang="ts">
const { t, tm, rt } = useI18n()
// Project names are proper nouns: never translated, same order as projects.items in the locales.
const NAMES = ['Highfield Studio', 'Coastal Fretworks', 'PocketMix']
const items = computed(() => (tm('projects.items') as any[]).map((p, i) => ({
  name: NAMES[i]!, summary: rt(p.summary), status: rt(p.status),
  url: p.url ? rt(p.url) : '', stack: (p.stack || []).map((s: any) => rt(s)),
})))
const lead = items

// Logos: drop a file at assets/logos/<name-in-lowercase-with-hyphens>.svg (e.g. pocketmix.svg). A single-colour SVG is
// tinted with the active theme; a .webp/.png (transparent, light-coloured for the dark themes) is shown as is.
// Without a file the name is shown as text.
const slug = (name: string) => name.toLowerCase().replace(/\s+/g, '-')
const imgLogos = import.meta.glob('../assets/logos/*.{png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const logoImg = (name: string) => Object.entries(imgLogos).find(([k]) => /\.(png|webp)$/.test(k) && k.includes(`/${slug(name)}.`))?.[1] ?? ''
const rawLogos = import.meta.glob('../assets/logos/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>
const logoFor = (name: string) => {
  const file = Object.keys(rawLogos).find(k => k.endsWith(`/${slug(name)}.svg`))
  if (!file) return ''
  return rawLogos[file]!
    .replace(/<\?xml[^>]*\?>/, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<defs>[\s\S]*?<\/defs>/g, '')
    .replace(/\s(class|id|data-name|style)="[^"]*"/g, '').replace(/\sfill="(?!none)[^"]*"/g, '')
    .replace('<svg', '<svg fill="currentColor" aria-hidden="true" class="h-full w-auto"')
}
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
                <svg v-if="p.name === 'PocketMix'" viewBox="0 0 400 260" class="h-full w-full" fill="none" stroke="currentColor" aria-hidden="true">
                  <g v-for="(v, k) in fader" :key="k" :transform="`translate(${50 + k * 60} 0)`">
                    <line x1="0" y1="40" x2="0" y2="220" stroke-width="1" opacity="0.35" />
                    <rect x="-12" :y="40 + (1 - v) * 150" width="24" height="30" stroke-width="1.5" fill="currentColor" fill-opacity="0.15" />
                  </g>
                  <path d="M20 20 Q80 -10 140 20 T260 20 T380 20" stroke-width="1" opacity="0.5" />
                </svg>
                <svg v-else viewBox="0 0 400 260" class="h-full w-full" fill="none" stroke="currentColor" aria-hidden="true">
                  <line v-for="(y, k) in [58, 90, 122, 154, 186, 218]" :key="'s' + y" x1="40" :y1="y" x2="386" :y2="y" :stroke-width="0.8 + k * 0.35" opacity="0.7" />
                  <line v-for="(x, k) in [40, 112, 178, 238, 292, 342, 386]" :key="'f' + x" :x1="x" y1="58" :x2="x" y2="218" :stroke-width="k ? 1 : 4" opacity="0.5" />
                  <circle cx="208" cy="138" r="5" fill="currentColor" fill-opacity="0.5" stroke="none" /><circle cx="265" cy="138" r="5" fill="currentColor" fill-opacity="0.5" stroke="none" />
                </svg>
              </div>
            </div>
          </div>
          <div class="min-w-0 md:col-span-5" :class="i % 2 ? 'md:order-1' : ''">
            <p aria-hidden="true" class="font-serif text-[clamp(5rem,12vw,12rem)] italic leading-none text-accent/80">0{{ i + 1 }}</p>
            <p class="mt-4 text-small uppercase text-accent">{{ t(`projects.status.${p.status}`) }}</p>
            <h3 class="mt-3">
              <span class="sr-only">{{ p.name }}</span>
              <span v-if="logoFor(p.name)" aria-hidden="true" class="block h-[clamp(2rem,3.4vw,3.75rem)] text-bone" v-html="logoFor(p.name)"></span>
              <img v-else-if="logoImg(p.name)" :src="logoImg(p.name)" alt="" aria-hidden="true" class="block h-[clamp(4.5rem,8vw,8rem)] w-auto max-w-full" loading="lazy" />
              <span v-else aria-hidden="true" class="block font-serif text-h2 break-words hyphens-auto">{{ p.name }}</span>
            </h3>
            <p class="mt-4 text-bone-muted break-words hyphens-auto 2xl:text-xl">{{ p.summary }}</p>
            <p v-if="p.stack.length" class="mt-4 text-small uppercase text-bone-muted">{{ p.stack.join(' / ') }}</p>
            <a v-if="p.url" data-cursor-hover :href="p.url" target="_blank" rel="noopener noreferrer" class="mt-6 inline-block border-b border-accent text-accent">{{ t('projects.visit') }}<span class="sr-only"> - {{ p.name }}</span></a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
