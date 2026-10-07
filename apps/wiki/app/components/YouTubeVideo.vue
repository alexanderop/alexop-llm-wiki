<script setup lang="ts">
import { Button as UiButton } from '@commonplace/ui/button'
import { youtubeVideoId } from '~/utils/youtube'
const props = defineProps<{ sourceUrl: string; title: string }>()
const videoId = computed(() => youtubeVideoId(props.sourceUrl))
const online = ref(true)
const playing = ref(false)
watch(videoId, () => { playing.value = false })
function updateConnection() { online.value = navigator.onLine; if (!online.value) playing.value = false }
onMounted(() => {
  updateConnection()
  window.addEventListener('online', updateConnection)
  window.addEventListener('offline', updateConnection)
})
onBeforeUnmount(() => {
  window.removeEventListener('online', updateConnection)
  window.removeEventListener('offline', updateConnection)
})
</script>
<template>
  <div v-if="videoId" class="source-video">
    <iframe v-if="online && playing" :key="videoId" :src="`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&autoplay=1`" :title="`YouTube video: ${title}`" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen />
    <UiButton v-else-if="online" variant="plain" size="inherit" class="source-video-preview" :aria-label="`Play YouTube video: ${title}`" @click="playing = true">
      <img :src="`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`" alt="" width="480" height="360" loading="lazy" />
      <span class="video-play"><ResourceIcon type="youtube" /><span>Play video</span></span>
    </UiButton>
    <div v-else class="source-video-offline"><ResourceIcon type="youtube" /><p>Connect to the internet to watch this video.</p></div>
    <a :href="`https://www.youtube.com/watch?v=${videoId}`" target="_blank" rel="noopener noreferrer" class="source-video-link">Watch on YouTube ↗</a>
  </div>
</template>
<style scoped>
.source-video{margin:24px 0 28px}.source-video iframe{display:block;width:100%;height:auto;aspect-ratio:16/9;min-height:200px;border:1px solid var(--line);border-radius:10px;background:#111}.source-video-preview{position:relative;display:block;width:100%;aspect-ratio:16/9;min-height:200px;overflow:hidden;border:1px solid var(--line);border-radius:10px;background:#111;padding:0}.source-video-preview img{display:block;width:100%;height:100%;object-fit:cover}.video-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:10px;padding:15px 22px;border-radius:10px;color:white;background:#b91c1c;font-size:15px;white-space:nowrap;box-shadow:0 4px 20px #0005}.video-play .ui-icon{width:26px;height:26px}.source-video-preview:hover .video-play{background:#991b1b}.source-video-link{display:inline-block;font-size:12px;color:var(--terra);padding:10px 0;min-height:var(--control-target)}.source-video-offline{aspect-ratio:16/9;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--muted);padding:24px;text-align:center}.source-video-offline p{font-size:14px;margin:0}
</style>
