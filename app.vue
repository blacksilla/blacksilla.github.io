<script setup lang="ts">
const head = useLocaleHead({ addDirAttribute: true, addSeoAttributes: true, identifierAttribute: 'id' })
const { t } = useI18n()
useHead({
  htmlAttrs: { lang: head.value.htmlAttrs!.lang, dir: head.value.htmlAttrs!.dir },
  link: head.value.link || [],
  meta: head.value.meta || [],
})
useSeoMeta({ title: () => t('meta.title'), description: () => t('meta.description'), ogTitle: () => t('meta.title'), ogDescription: () => t('meta.description') })
</script>

<template>
  <div data-cursor aria-hidden="true" class="pointer-events-none fixed left-0 top-0 z-[60] hidden"></div>
  <NuxtPage />
  <ClientOnly><SecretsIntro /><SecretBurst /></ClientOnly>
</template>
