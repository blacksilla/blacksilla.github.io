# Afonso Silva — portfolio

Personal portfolio of Afonso Silva, a full-stack developer based in Madeira, Portugal.

**Live:** https://blacksilla.github.io

A dark, cinematic single-page site: a full-viewport hero with an animated audio waveform, project panels, a stack marquee, five languages and a few things hidden for the curious.

## Stack

- [Nuxt 3](https://nuxt.com) with static generation (`nuxt generate`)
- [Tailwind CSS](https://tailwindcss.com) via `@nuxtjs/tailwindcss`
- [`@nuxtjs/i18n`](https://i18n.nuxtjs.org) — English, Portuguese, Spanish, French and German
- [GSAP](https://gsap.com) (ScrollTrigger) and [Lenis](https://lenis.darkroom.engineering) for motion and smooth scrolling
- [`@nuxt/fonts`](https://fonts.nuxt.com) for self-hosted fonts
- GitHub Actions, publishing to GitHub Pages

## Getting started

Requires Node 24 (the version CI uses).

```bash
npm ci
npm run dev        # http://localhost:3000
npm run generate   # static build into .output/public
npm run preview    # serve the production build locally
```

## Project structure

```
app.vue              root, SEO and language head tags
pages/index.vue      the single page, composed from section components
components/          Hero, About, Projects, Stack, Journey, Contact, Footer, theme picker, code console
composables/         theme and secret-code state
plugins/             GSAP, Lenis and motion setup, theme and secrets plugins
assets/css/          design tokens (main.css), themes (themes.css), motion (motion.css)
i18n/locales/        en, pt, es, fr, de
public/images/       portrait, project images, favicons
```

## Languages

English lives at `/`; the others at `/pt`, `/es`, `/fr` and `/de`. All copy is in `i18n/locales/*.json`, and every file must keep the same keys as `en.json`. Project names are proper nouns and are kept in code, not in the translation files, so they are never translated.

To add a language, add a file in `i18n/locales/`, then add an entry to the `locales` list in `nuxt.config.ts` and to the prerender routes.

## Design and motion

- Colours are CSS variables (`--c-ink`, `--c-bone`, `--c-accent`, …) mapped to Tailwind tokens, so the whole site can change theme at runtime.
- Type and spacing scale with the smaller of the viewport's width and height, so the layout holds on short laptop screens and on ultrawide monitors alike.
- Motion respects `prefers-reduced-motion`: with it on, nothing is hidden or animated.

## Hidden themes

The site has a few extra colour themes that unlock through easter eggs. Clues are shown on the page itself, and a code console is available from the footer for touch screens.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `.output/public` to GitHub Pages. The repository's Pages source must be set to **GitHub Actions**.

## Notes

- Contact goes through [linktr.ee/blacksilla](https://linktr.ee/blacksilla); no email address is published.
- Several texts are still placeholders; they are listed under `_todo` in the locale files.
