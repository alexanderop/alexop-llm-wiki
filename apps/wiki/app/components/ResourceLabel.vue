<script setup lang="ts">
import { youtubeVideoId } from '~/utils/youtube'
import type { ResourceType } from '#shared/wiki'
const props = defineProps<{ type?: ResourceType; sourceUrl?: string }>()
const { resourceLabel } = useI18n()
const onYouTube = computed(() => props.type !== 'youtube' && Boolean(youtubeVideoId(props.sourceUrl)))
const onX = computed(() => {
  if (props.type !== 'social' || !props.sourceUrl) return false
  try { return ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com'].includes(new URL(props.sourceUrl).hostname) }
  catch { return false }
})
</script>
<template>
  <span class="resource-label"><ResourceIcon :type="type" />{{ resourceLabel(type) }}<span v-if="onYouTube" class="resource-platform"><span aria-hidden="true">·</span><ResourceIcon type="youtube" />YouTube</span><span v-if="onX" class="resource-platform"><span aria-hidden="true">·</span>X / Tweet</span></span>
</template>
