<script setup lang="ts">
import { MarkdownDocument } from '@comark/vue'
import type { MarkdownDocument as Document } from 'comark'
import Insight from './Insight.vue'
import SourceReference from './SourceReference.vue'
import ProseLink from './ProseLink.vue'
import ProsePre from './ProsePre.vue'
import WikiDiagram from './WikiDiagram.vue'
import type { Node } from 'comark'
const props = defineProps<{ document: string }>()
function diagrams(node: Node): Node {
  if (typeof node === 'string' || node[0] === null) return node
  const [tag, attributes, ...children] = node
  if (tag === 'pre' && attributes.language === 'mermaid') {
    const text = (value: Node): string => typeof value === 'string' ? value : value.slice(2).map(child => text(child as Node)).join('')
    return ['wiki-diagram', { source: children.map(text).join('') }]
  }
  return [tag, attributes, ...children.map(diagrams)]
}
const parsed = computed<Document>(() => {
  const document: Document = JSON.parse(props.document)
  return { ...document, nodes: document.nodes.map(diagrams) }
})
const components = { insight: Insight, 'source-reference': SourceReference, a: ProseLink, pre: ProsePre, 'wiki-diagram': WikiDiagram }
</script>
<template><MarkdownDocument :value="parsed" :components="components" class="prose" /></template>
