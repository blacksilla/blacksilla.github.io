<template>
  <footer class="border-t border-hairline px-gutter py-10">
    <div class="mx-auto flex max-w-stage flex-wrap items-end justify-between gap-6">
      <p class="text-small text-bone-muted">&copy; {{ new Date().getFullYear() }} {{ $t('footer.rights') }}</p>
      <ThemePicker />
    </div>
  </footer>
</template>
