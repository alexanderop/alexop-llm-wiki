<script setup lang="ts">
const props = defineProps<{ name: string; src?: string }>()
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>
<template>
  <span class="author-avatar" aria-hidden="true">
    <img v-if="src && !failed" :src="src" alt="" width="96" height="96" @error="failed = true" />
    <span v-else>{{ Array.from(name)[0] }}</span>
  </span>
</template>
