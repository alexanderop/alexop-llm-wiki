<script setup lang="ts">
import { renderWikiDiagram } from '~/utils/mermaid'
const props = defineProps<{ source: string }>()
const { theme } = useTheme()
const svg = ref('')
const failed = ref(false)
let revision = 0
let stop: (() => void) | undefined
onMounted(() => {
  stop = watch([() => props.source, theme], async () => {
    const current = ++revision
    failed.value = false
    try {
      const result = await renderWikiDiagram(props.source)
      if (current === revision) svg.value = result
    } catch {
      if (current === revision) { svg.value = ''; failed.value = true }
    }
  }, { immediate: true })
})
onBeforeUnmount(() => { revision++; stop?.() })
</script>

<template>
  <figure class="wiki-diagram">
    <!-- Only Mermaid's strict-mode sanitized SVG is inserted here. -->
    <div v-if="svg" class="wiki-diagram__canvas" role="region" aria-label="Diagram" tabindex="0" v-html="svg" />
    <p v-else class="wiki-diagram__status">{{ failed ? 'This diagram could not be displayed. Its source is available below.' : 'Diagram source' }}</p>
    <details :open="!svg">
      <summary>View diagram source</summary>
      <pre tabindex="0"><code>{{ source }}</code></pre>
    </details>
  </figure>
</template>

<style scoped>
.wiki-diagram { margin: 2rem 0; border: 1px solid var(--line); border-radius: 12px; background: var(--paper); overflow: hidden; }
.wiki-diagram__canvas { overflow-x: auto; padding: 1.5rem 1rem; }
.wiki-diagram__canvas :deep(svg) { display: block; margin: auto; max-width: none !important; height: auto; }
.wiki-diagram__status { padding: 0 1rem; color: var(--muted); }
details { border-top: 1px solid var(--line); padding: .5rem 1rem; }
summary { cursor: pointer; color: var(--muted); font-size: .8rem; min-height: 44px; align-content: center; }
pre { max-height: 24rem; overflow: auto; }
</style>
