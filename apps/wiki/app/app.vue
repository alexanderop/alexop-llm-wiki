<script setup lang="ts">
const { t } = useI18n()
</script>
<template><NuxtPwaManifest /><a href="#main-content" class="skip-link">{{ t('skip') }}</a><NuxtPage /></template>
