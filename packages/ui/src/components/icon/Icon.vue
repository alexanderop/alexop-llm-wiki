<script setup lang="ts">
defineProps<{ name: 'video' | 'microphone' | 'book' | 'article' | 'film' | 'documentation' | 'link' | 'message' }>()
</script>
<template>
  <svg class="ui-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'video'"><rect x="3" y="5" width="18" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></template>
    <template v-else-if="name === 'microphone'"><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" /></template>
    <template v-else-if="name === 'book'"><path d="M12 5v15M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z" /></template>
    <template v-else-if="name === 'article'"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5M8 18h8" /></template>
    <template v-else-if="name === 'film'"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M7 12h10" /></template>
    <template v-else-if="name === 'documentation'"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M9 12l-2 3 2 3M15 12l2 3-2 3" /></template>
    <template v-else-if="name === 'message'"><path d="M21 11a8 8 0 0 1-8 8H6l-4 3V11a8 8 0 0 1 8-8h3a8 8 0 0 1 8 8Z" /><path d="M7 9h9M7 13h6" /></template>
    <template v-else><path d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(0 -1)" /></template>
  </svg>
</template>
<style scoped>.ui-icon{display:inline-block;flex-shrink:0;vertical-align:middle}</style>
