<template>
  <div class="bg-ink text-bone font-sans text-body overflow-x-clip">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-accent">{{ $t('nav.skip') }}</a>
    <AppHeader />
    <main id="main">
      <HeroSection />
      <AboutSection />
      <MarqueeBand />
      <ProjectsSection />
      <StackSection />
      <JourneySection />
      <MarqueeBand />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>
