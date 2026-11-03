<script setup lang="ts">
// A short, simple SVG animation played when a secret is found (or a theme is picked again).
// Plain geometric nods only, coloured with the active theme's variables; purely decorative.
const { burst } = useSecrets()
let timer: ReturnType<typeof setTimeout>
watch(() => burst.value?.n, () => {
  clearTimeout(timer)
  if (burst.value) timer = setTimeout(() => { burst.value = null }, 3000)
})
onBeforeUnmount(() => clearTimeout(timer))

// Deterministic data (no Math.random).
const sparks = [0, 45, 90, 135, 180, 225, 270, 315]
const rain = Array.from({ length: 12 }, (_, i) => ({ x: 8 + i * 16.5, d: ((i * 7) % 11) * 0.09, chars: [...'01ﾊﾐ7ｱZ01ﾘ'].slice(i % 4, (i % 4) + 6) }))
const heart = [' ## ## ', '#######', '#######', ' ##### ', '  ###  ', '   #   '].flatMap((row, y) => [...row].map((c, x) => c === '#' ? { x: 30 + x * 20, y: 48 + y * 20, d: (x + y) * 0.05 } : null).filter(Boolean)) as { x: number, y: number, d: number }[]
const stars = [[30, 40], [60, 24], [150, 30], [176, 64], [24, 110], [172, 120], [48, 170], [100, 182], [150, 168], [118, 20]]
const slats = Array.from({ length: 9 }, (_, i) => i)
</script>

<template>
  <Transition leave-active-class="transition-opacity duration-700" leave-to-class="opacity-0">
    <div v-if="burst" :key="burst.n" aria-hidden="true" class="burst pointer-events-none fixed inset-0 z-[55] grid place-items-center">
      <div class="burst-flash absolute inset-0"></div>
      <svg viewBox="0 0 200 200" class="relative h-[min(56vmin,26rem)] w-[min(56vmin,26rem)] overflow-visible" fill="none">
        <!-- kanto / Volt: a lightning bolt with sparks -->
        <g v-if="burst.id === 'kanto'">
          <line v-for="(a, i) in sparks" :key="a" x1="100" y1="6" x2="100" y2="24" :transform="`rotate(${a} 100 100)`" stroke="rgb(var(--c-accent))" stroke-width="5" stroke-linecap="round" class="a a-spark" :style="{ '--d': `${0.25 + i * 0.04}s` }" />
          <polygon points="112,14 58,108 98,108 84,188 146,86 104,86" fill="rgb(var(--c-accent))" class="a a-pop" />
        </g>
        <!-- saiyan: aura rings and an energy beam -->
        <g v-else-if="burst.id === 'saiyan'">
          <circle v-for="n in 3" :key="n" cx="100" cy="100" r="34" stroke="rgb(var(--c-accent))" stroke-width="3" class="a a-ring" :style="{ '--d': `${(n - 1) * 0.28}s` }" />
          <circle cx="100" cy="100" r="16" fill="rgb(var(--c-bone))" class="a a-pop" />
          <rect x="100" y="91" width="180" height="18" rx="9" fill="rgb(var(--c-accent))" class="a a-beam" />
        </g>
        <!-- matrix: falling glyphs -->
        <g v-else-if="burst.id === 'matrix'" font-family="ui-monospace, monospace" font-size="12" fill="rgb(var(--c-accent))">
          <text v-for="(c, i) in rain" :key="i" :x="c.x" y="100" class="a a-fall" :style="{ '--d': `${c.d}s` }">
            <tspan v-for="(ch, k) in c.chars" :key="k" :x="c.x" :dy="k ? 14 : -40">{{ ch }}</tspan>
          </text>
        </g>
        <!-- synthwave: a rising striped sun over a grid horizon -->
        <g v-else-if="burst.id === 'synthwave'">
          <g class="a a-rise">
            <path d="M36 124 A64 64 0 0 1 164 124 Z" fill="rgb(var(--c-accent))" />
            <rect x="30" y="96" width="140" height="3" fill="rgb(var(--c-ink))" /><rect x="30" y="106" width="140" height="4" fill="rgb(var(--c-ink))" /><rect x="30" y="116" width="140" height="6" fill="rgb(var(--c-ink))" />
          </g>
          <line x1="10" y1="124" x2="190" y2="124" stroke="rgb(var(--c-accent-2))" stroke-width="2" />
          <line v-for="x in [-40, 20, 70, 100, 130, 180, 240]" :key="x" x1="100" y1="124" :x2="x" y2="196" stroke="rgb(var(--c-accent-2))" stroke-width="1.5" class="a a-fade" />
          <line v-for="y in [138, 154, 174]" :key="y" x1="0" :y1="y" x2="200" :y2="y" stroke="rgb(var(--c-accent-2))" stroke-width="1.5" class="a a-fade" />
        </g>
        <!-- gameboy: a pixel heart -->
        <g v-else-if="burst.id === 'gameboy'" class="a a-pulse">
          <rect v-for="(p, i) in heart" :key="i" :x="p.x" :y="p.y" width="18" height="18" fill="rgb(var(--c-accent))" class="a a-pop" :style="{ '--d': `${p.d}s` }" />
        </g>
        <!-- hyrule / Evergreen: a sword rising, sparkles -->
        <g v-else-if="burst.id === 'hyrule'">
          <g class="a a-rise">
            <polygon points="95,22 100,4 105,22" fill="rgb(var(--c-bone))" /><rect x="95" y="22" width="10" height="96" fill="rgb(var(--c-bone))" />
            <rect x="74" y="118" width="52" height="9" rx="3" fill="rgb(var(--c-accent))" /><rect x="96" y="127" width="8" height="26" fill="rgb(var(--c-accent-2))" /><circle cx="100" cy="160" r="7" fill="rgb(var(--c-accent))" />
          </g>
          <path v-for="(s, i) in stars.slice(0, 5)" :key="i" :transform="`translate(${s[0]} ${s[1]})`" d="M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z" fill="rgb(var(--c-accent))" class="a a-twinkle" :style="{ '--d': `${i * 0.2}s` }" />
        </g>
        <!-- jedi / Saber: a glowing blade igniting -->
        <g v-else-if="burst.id === 'jedi'">
          <rect x="91" y="150" width="18" height="38" rx="3" fill="rgb(var(--c-bone-muted))" /><rect x="88" y="146" width="24" height="6" fill="rgb(var(--c-bone))" />
          <g class="a a-grow">
            <rect x="85" y="14" width="30" height="132" rx="15" fill="rgb(var(--c-accent))" opacity="0.22" />
            <rect x="93" y="18" width="14" height="128" rx="7" fill="rgb(var(--c-accent))" /><rect x="98" y="22" width="4" height="120" rx="2" fill="rgb(var(--c-bone))" />
          </g>
        </g>
        <!-- lumos / Candlelight: a wand tip lighting up -->
        <g v-else-if="burst.id === 'lumos'">
          <line x1="50" y1="178" x2="128" y2="76" stroke="rgb(var(--c-bone))" stroke-width="5" stroke-linecap="round" class="a a-fade" />
          <circle v-for="n in 3" :key="n" cx="132" cy="70" r="8" fill="rgb(var(--c-accent))" class="a a-glow" :style="{ '--d': `${(n - 1) * 0.3}s` }" />
          <path transform="translate(132 70)" d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="rgb(var(--c-accent))" class="a a-pop" />
        </g>
        <!-- noir: venetian blinds opening on a spotlight -->
        <g v-else-if="burst.id === 'noir'">
          <circle cx="100" cy="100" r="38" stroke="rgb(var(--c-bone))" stroke-width="2.5" class="a a-fade" />
          <rect v-for="i in slats" :key="i" x="0" :y="(i - 1) * 22.2" width="200" height="22.2" fill="rgb(var(--c-bone))" class="a a-open" :style="{ '--d': `${0.2 + (i - 1) * 0.06}s` }" />
        </g>
        <!-- midnight: a crescent moon and twinkling stars -->
        <g v-else-if="burst.id === 'midnight'">
          <path d="M112 38 A62 62 0 1 0 112 162 A48 48 0 1 1 112 38 Z" fill="rgb(var(--c-accent))" class="a a-rise" />
          <circle v-for="(s, i) in stars" :key="i" :cx="s[0]" :cy="s[1]" :r="i % 3 ? 2 : 3" fill="rgb(var(--c-bone))" class="a a-twinkle" :style="{ '--d': `${i * 0.17}s` }" />
        </g>
      </svg>
    </div>
  </Transition>
</template>

<style scoped>
.burst-flash { background: rgb(var(--c-accent)); opacity: 0; animation: flash 0.9s var(--ease-suave) both; }
.a { transform-box: fill-box; transform-origin: center; animation-delay: var(--d, 0s); animation-fill-mode: both; animation-timing-function: var(--ease-suave); }
.a-pop { animation-name: pop; animation-duration: 0.7s; }
.a-spark { animation-name: spark; animation-duration: 0.9s; }
.a-ring { animation-name: ring; animation-duration: 1.4s; }
.a-beam { transform-origin: left center; animation-name: beam; animation-duration: 1.6s; animation-delay: 0.5s; }
.a-fall { animation-name: fall; animation-duration: 2.2s; animation-timing-function: linear; }
.a-rise { animation-name: rise; animation-duration: 1.1s; }
.a-fade { animation-name: fade; animation-duration: 1s; animation-delay: 0.4s; }
.a-pulse { animation-name: pulse; animation-duration: 0.9s; animation-delay: 0.9s; animation-iteration-count: 2; }
.a-grow { transform-origin: 50% 100%; animation-name: grow; animation-duration: 0.9s; }
.a-twinkle { animation-name: twinkle; animation-duration: 1.4s; animation-iteration-count: 2; }
.a-glow { animation-name: glow; animation-duration: 1.8s; }
.a-open { transform-origin: center; animation-name: open; animation-duration: 0.7s; }
@keyframes pop { 0% { transform: scale(0.2); opacity: 0 } 55% { transform: scale(1.1); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
@keyframes spark { 0% { opacity: 0; transform: scale(0.4) } 40% { opacity: 1 } 100% { opacity: 0; transform: scale(1.3) } }
@keyframes ring { 0% { transform: scale(0.2); opacity: 0.9 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes beam { 0% { transform: scaleX(0); opacity: 1 } 55% { transform: scaleX(1); opacity: 1 } 100% { transform: scaleX(1); opacity: 0 } }
@keyframes fall { 0% { transform: translateY(-80px); opacity: 0 } 25% { opacity: 1 } 100% { transform: translateY(70px); opacity: 0 } }
@keyframes rise { from { transform: translateY(46px); opacity: 0 } to { transform: none; opacity: 1 } }
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes pulse { 50% { transform: scale(1.08) } }
@keyframes grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes twinkle { 0%, 100% { opacity: 0.15 } 50% { opacity: 1 } }
@keyframes glow { 0% { transform: scale(1); opacity: 0.35 } 100% { transform: scale(11); opacity: 0 } }
@keyframes open { to { transform: scaleY(0) } }
@keyframes flash { 0% { opacity: 0 } 15% { opacity: 0.16 } 100% { opacity: 0 } }
@media (prefers-reduced-motion: reduce) {
  .a, .burst-flash { animation: none !important; opacity: 1; }
  .burst-flash { opacity: 0; }
  .a-ring, .a-beam, .a-open, .a-glow { display: none; }
}
</style>
