import type { Config } from 'tailwindcss'

// Colours are runtime CSS variables (assets/css/themes.css)
const c = (n: string) => `rgb(var(--c-${n}) / <alpha-value>)`
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        ink: c('ink'),
        'ink-soft': c('ink-soft'),
        bone: c('bone'),
        'bone-muted': c('bone-muted'),
        accent: c('accent'),
        'accent-2': c('accent-2'),
        hairline: 'rgb(var(--c-bone) / 0.12)',
      },
      maxWidth: { stage: '140rem' },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(3rem, calc(min(100vw, 170svh) * 0.1 - 2.5rem), 8.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        mega: ['clamp(5rem, calc(min(100vw, 170svh) * 0.2), 28rem)', { lineHeight: '0.85', letterSpacing: '-0.035em' }],
        h2: ['clamp(2rem, calc(min(100vw, 170svh) * 0.04), 4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        body: ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.7' }],
        small: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
      },
      spacing: { section: 'clamp(4rem, calc(min(100vw, 170svh) * 0.1 - 2rem), 12rem)', gutter: 'clamp(1.25rem, calc(0.5rem + min(100vw, 170svh) * 0.03), 4rem)' },
      transitionTimingFunction: { suave: 'var(--ease-suave)' },
      transitionDuration: { slow: 'var(--dur-slow)', suave: 'var(--dur-eased)' },
    },
  },
}
