import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const orig = new WeakMap<Element, string>()
const lineTweens = new WeakMap<Element, gsap.core.Tween>()

function unsplit(el: Element) {
  const t = orig.get(el)
  if (t === undefined) return
  el.textContent = t
  el.removeAttribute('aria-label')
  orig.delete(el)
}

// Split into words, group by offsetTop into masked lines; returns the inner line elements.
function split(el: HTMLElement): HTMLElement[] {
  const text = (el.textContent || '').trim()
  orig.set(el, text)
  el.textContent = ''
  const words = text.split(/\s+/).map((w) => {
    const s = document.createElement('span')
    s.style.display = 'inline-block'
    s.textContent = w
    el.append(s, ' ')
    return s
  })
  const groups: HTMLElement[][] = []
  let top = -1
  for (const w of words) {
    if (w.offsetTop !== top) { top = w.offsetTop; groups.push([]) }
    groups[groups.length - 1].push(w)
  }
  el.textContent = ''
  el.setAttribute('aria-label', text)
  return groups.map((g) => {
    const line = document.createElement('span')
    const inner = document.createElement('span')
    line.className = 'm-line'
    inner.className = 'm-line-in'
    line.setAttribute('aria-hidden', 'true')
    inner.textContent = g.map((w) => w.textContent).join(' ')
    line.append(inner)
    el.append(line)
    return inner
  })
}

const clamp = gsap.utils.clamp
const seen = (el: Element) => el.setAttribute('data-seen', '')

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)
  const html = document.documentElement
  const { locale } = nuxtApp.$i18n as any
  const $ = <T extends HTMLElement>(s: string) => gsap.utils.toArray<T>(s)
  let mm: gsap.MatchMedia | undefined
  let cur: any // active matchMedia context (for tweens created after build, e.g. on resize)
  let token = 0
  let introDone = false

  function revert() {
    mm?.revert()
    mm = undefined
    $('[data-reveal-lines]').forEach(unsplit)
  }

  // Split + (unless already seen / deferred to the intro) a once-on-scroll line rise.
  function setupLines(el: HTMLElement, play = true) {
    const lines = split(el)
    gsap.set(el, { opacity: 1 })
    if (!play || el.hasAttribute('data-seen')) return lines
    lineTweens.set(el, gsap.fromTo(lines, { yPercent: 110 }, {
      yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      onStart: () => seen(el),
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    }))
    return lines
  }

  function build() {
    mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: reduce)', () => {
      html.classList.remove('js-motion')
      html.classList.add('motion-ready')
    })
    mm.add('(prefers-reduced-motion: no-preference)', (ctx: any) => {
      try {
        cur = ctx
        html.classList.add('js-motion')
        const lenis = new Lenis({ lerp: 0.08 })
        lenis.on('scroll', ScrollTrigger.update)
        const tickers: ((t: number) => void)[] = []
        const undo: (() => void)[] = []
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        const onClick = (e: MouseEvent) => {
          const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null
          const id = a?.getAttribute('href')?.slice(1)
          if (!a || !id || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey) return
          const target = id === 'top' ? 0 : document.getElementById(id)
          if (target === null) return
          e.preventDefault()
          const header = document.querySelector('header')?.getBoundingClientRect().height || 0
          lenis.scrollTo(target, { offset: -header, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
          history.replaceState(null, '', `#${id}`)
        }
        document.addEventListener('click', onClick)

        const hero = document.getElementById('top')
        const inHero = (el: Element) => !!hero && hero.contains(el)
        const reveal = { duration: 1.1, ease: 'expo.out' }
        const once = (trigger: Element) => ({ trigger, start: 'top 85%', once: true })

        // ---- generic reveals (hero ones belong to the intro timeline) ----
        $('[data-reveal]').filter((el) => !inHero(el)).forEach((el) => {
          if (el.hasAttribute('data-seen')) return
          gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, ...reveal, onStart: () => seen(el), scrollTrigger: once(el) })
        })
        $('[data-reveal-lines]').filter((el) => !inHero(el)).forEach((el) => { setupLines(el) })

        // ---- hero intro ----
        const waves = $<SVGPathElement>('[data-wave]')
        const portrait = hero?.querySelector<HTMLElement>('[data-portrait]')
        const startAmbient = () => {
          if (!waves.length || !hero) return
          const amb = waves.map((p, i) => gsap.to(p, {
            y: 6 + (i % 4) * 3, duration: 2.4 + (i % 7) * 0.45, ease: 'sine.inOut', yoyo: true, repeat: -1,
          }).progress(((i * 0.37) % 1)))
          ScrollTrigger.create({
            trigger: hero, start: 'top bottom', end: 'bottom top',
            onToggle: (s) => amb.forEach((t) => t.paused(!s.isActive)),
          })
          // scroll-linked amplitude (different per path), on scaleY so it never fights the ambient y
          gsap.to(waves, {
            scaleY: (i) => 1.15 + (i % 5) * 0.12, svgOrigin: '500 200', ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
          })
        }

        const heroH1 = hero?.querySelector<HTMLElement>('[data-reveal-lines]')
        const heroRev = hero ? $('[data-reveal]').filter(inHero) : []
        if (hero && !introDone) {
          const lines = heroH1 ? setupLines(heroH1, false) : []
          // draw lengths in screen space (non-scaling-stroke); overshoot is harmless
          const svg = waves[0]?.ownerSVGElement
          const sc = svg ? Math.max(1, svg.clientWidth / 1000, svg.clientHeight / 400) : 1
          const dash = waves.map((p) => Math.ceil(p.getTotalLength() * sc) + 2)
          gsap.set(waves, { strokeDasharray: (i: number) => dash[i], strokeDashoffset: (i: number) => dash[i] })
          const tl = gsap.timeline({
            defaults: { ease: 'expo.out' },
            onStart: () => { heroRev.forEach(seen); heroH1 && seen(heroH1) },
            onComplete: () => {
              introDone = true
              gsap.set(waves, { clearProps: 'strokeDasharray,strokeDashoffset' })
              startAmbient()
            },
          })
          if (portrait) tl.fromTo(portrait,
            { opacity: 0, scale: 1.06, clipPath: 'inset(0 0 100% 0)' },
            { opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 2.2, ease: 'power3.inOut' }, 0.3)
          tl.to(waves, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: { amount: 0.6 } }, 0.1)
          if (lines.length) tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.6, stagger: 0.12 }, 0.35)
          if (heroRev.length) tl.fromTo(heroRev, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out', stagger: 0.15 }, 0.9)
        } else {
          if (heroH1) setupLines(heroH1, false)
          startAmbient()
        }

        // portrait layered parallax (wrapper rises, image drifts the other way)
        if (hero && portrait) {
          const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
          gsap.fromTo(portrait, { yPercent: 0 }, { yPercent: -7, ease: 'none', scrollTrigger: st })
          const img = portrait.querySelector('img')
          if (img) gsap.fromTo(img, { scale: 1.12, yPercent: -5 }, { scale: 1.12, yPercent: 5, ease: 'none', scrollTrigger: st })
        }

        $('[data-parallax]').forEach((el) => {
          const s = parseFloat(el.dataset.parallax || '0.1')
          gsap.fromTo(el, { yPercent: -s * 100 }, { yPercent: s * 100, ease: 'none',
            scrollTrigger: { trigger: el.closest('[data-section]') || el.parentElement!, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
        })

        $('[data-parallax-img]').forEach((el) =>
          gsap.fromTo(el, { scale: 1.08, yPercent: -4 }, { scale: 1, yPercent: 4, ease: 'none',
            scrollTrigger: { trigger: el.parentElement!, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }))

        $('[data-timeline-line]').forEach((el) =>
          gsap.fromTo(el, { scaleY: 0, transformOrigin: 'top' }, { scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: el.parentElement!, start: 'top 80%', end: 'bottom 60%', scrub: 0.6 } }))

        // ---- project panels: clip unmask + staggered text, no pinning ----
        $('[data-panel]').forEach((panel) => {
          const media = panel.children[0]?.firstElementChild as HTMLElement | null
          const textCol = panel.children[1] as HTMLElement | undefined
          const texts = textCol ? Array.from(textCol.children) : []
          if (texts[0]) gsap.fromTo(texts[0], { xPercent: -6 }, { xPercent: 6, ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1 } })
          if (panel.hasAttribute('data-seen')) return
          const tl = gsap.timeline({
            defaults: { ease: 'expo.out' },
            onStart: () => seen(panel),
            scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
          })
          if (media) tl.fromTo(media, { clipPath: 'inset(0 0 100% 0)', scale: 1.06 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.2 }, 0)
          if (texts.length) tl.fromTo(texts, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.09 }, 0.25)
        })

        // ---- marquee: seamless loop, scroll-velocity boost, pause on hover/focus ----
        $('[data-marquee]').forEach((m) => {
          const track = m.querySelector<HTMLElement>('[data-marquee-track]')
          if (!track) return
          const loop = gsap.to(track, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 })
          let hold = 0, f = 1, boost = 0
          const on = () => { hold = 1 }, off = () => { hold = 0 }
          m.addEventListener('pointerenter', on); m.addEventListener('pointerleave', off)
          m.addEventListener('focusin', on); m.addEventListener('focusout', off)
          tickers.push(() => {
            boost += (clamp(-10, 10, lenis.velocity * 0.12) - boost) * 0.08
            f += ((hold ? 0 : 1) - f) * 0.08
            loop.timeScale(f * (1 + boost))
          })
          undo.push(() => {
            m.removeEventListener('pointerenter', on); m.removeEventListener('pointerleave', off)
            m.removeEventListener('focusin', on); m.removeEventListener('focusout', off)
          })
        })
        const tickAll = () => tickers.forEach((fn) => fn(0))
        gsap.ticker.add(tickAll)

        // ---- re-split lines on width resize (debounced), never replaying the intro ----
        let w = innerWidth, timer: any
        const onResize = () => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            if (innerWidth === w) return
            w = innerWidth
            $('[data-reveal-lines]').forEach((el) => {
              if (inHero(el) && !introDone) return
              const tw = lineTweens.get(el)
              tw?.scrollTrigger?.kill(); tw?.kill(); lineTweens.delete(el)
              unsplit(el)
              ctx.add(() => { setupLines(el) })
            })
            ScrollTrigger.refresh()
          }, 200)
        }
        addEventListener('resize', onResize)

        return () => {
          undo.forEach((u) => u())
          clearTimeout(timer)
          removeEventListener('resize', onResize)
          document.removeEventListener('click', onClick)
          gsap.ticker.remove(tick)
          gsap.ticker.remove(tickAll)
          lenis.destroy()
        }
      } catch (e) {
        html.classList.remove('js-motion') // never leave content hidden
        console.error(e)
      }
    })
  }

  // Revert, wait for DOM + fonts (line measuring), rebuild. Token drops stale runs.
  async function rebuild(newPage = false) {
    const my = ++token
    if (newPage) { introDone = false; html.classList.remove('motion-ready') }
    revert()
    await nextTick()
    await document.fonts?.ready
    if (my !== token) return
    build()
    html.classList.add('motion-ready')
    ScrollTrigger.refresh()
  }

  // Cursor ring + theme wipe: created once, independent of rebuilds.
  function chrome() {
    const cmm = gsap.matchMedia()
    cmm.add({ motion: '(prefers-reduced-motion: no-preference)', fine: '(pointer: fine)' }, (ctx: any) => {
      const { motion, fine } = ctx.conditions
      if (!motion) return
      const cleanups: (() => void)[] = []

      const ring = document.querySelector<HTMLElement>('[data-cursor]')
      if (fine && ring) {
        ring.classList.add('is-on'); ring.style.display = 'block'
        gsap.set(ring, { opacity: 0 })
        const qx = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power3.out' })
        const qy = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power3.out' })
        const show = (v: number) => gsap.to(ring, { opacity: v, duration: 0.3, overwrite: 'auto' })
        const move = (e: PointerEvent) => { qx(e.clientX); qy(e.clientY); show(1) }
        const over = (e: Event) => {
          const h = !!(e.target as Element).closest?.('[data-cursor-hover]')
          ring.classList.toggle('is-hover', h)
          gsap.to(ring, { scale: h ? 1.9 : 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
        }
        const leave = () => show(0)
        addEventListener('pointermove', move); addEventListener('pointerover', over)
        document.documentElement.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          removeEventListener('pointermove', move); removeEventListener('pointerover', over)
          document.documentElement.removeEventListener('pointerleave', leave)
          ring.classList.remove('is-on', 'is-hover'); ring.style.display = ''
        })
      }

      // soft radial accent wash when the theme changes
      const mo = new MutationObserver((recs) => {
        if (recs.every((r) => r.oldValue === null)) return // initial theme assignment
        const veil = document.createElement('div')
        veil.className = 'm-theme-wipe'
        veil.setAttribute('aria-hidden', 'true')
        document.body.append(veil)
        gsap.timeline({ onComplete: () => veil.remove() })
          .fromTo(veil, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1.2, duration: 0.35, ease: 'power2.out' })
          .to(veil, { opacity: 0, scale: 1.5, duration: 0.45, ease: 'power2.in' })
      })
      mo.observe(html, { attributes: true, attributeFilter: ['data-theme'], attributeOldValue: true })
      cleanups.push(() => mo.disconnect())
      return () => cleanups.forEach((c) => c())
    })
  }

  nuxtApp.hook('app:mounted', () => {
    rebuild().then(() => {
      chrome()
      // late fonts/images shift layout: refresh when document height actually changes
      let h = document.body.scrollHeight, t: any
      new ResizeObserver(() => {
        clearTimeout(t)
        t = setTimeout(() => { const n = document.body.scrollHeight; if (Math.abs(n - h) > 2) { h = n; ScrollTrigger.refresh() } }, 200)
      }).observe(document.body)
      addEventListener('load', () => ScrollTrigger.refresh())
    })
    watch(locale, () => rebuild())
    nuxtApp.$router.afterEach((to: any, from: any) => { if (to.path !== from.path) rebuild(true) })
  })

  return { provide: { gsap, ScrollTrigger } }
})
