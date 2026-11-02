<template>
  <section id="contact" data-section aria-labelledby="contact-h" class="border-t border-hairline px-gutter py-section">
    <div class="mx-auto max-w-stage">
      <h2 id="contact-h" data-reveal-lines class="font-serif text-display break-words hyphens-auto">{{ $t('contact.heading') }}</h2>
      <p data-reveal class="mt-6 max-w-xl text-bone-muted">{{ $t('contact.line') }}</p>
      <a data-reveal :href="`mailto:${$t('contact.email')}`" class="mt-10 inline-block max-w-full break-all font-serif text-3xl text-accent md:text-5xl 2xl:text-8xl">{{ $t('contact.email') }}</a>
      <div data-reveal class="mt-16">
        <p class="text-small uppercase text-bone-muted">{{ $t('contact.links') }}</p>
        <ul class="mt-3">
          <li><a data-cursor-hover href="https://github.com/blacksilla" target="_blank" rel="noopener noreferrer" class="border-b border-hairline hover:text-accent">GitHub</a></li>
        </ul>
      </div>
    </div>
  </section>
</template>
