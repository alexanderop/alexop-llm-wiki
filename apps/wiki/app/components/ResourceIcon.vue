<script setup lang="ts">
import { Icon } from '@commonplace/ui/icon'
import type { ResourceType } from '#shared/wiki'
withDefaults(defineProps<{ type?: ResourceType }>(), { type: 'other' })
const icons = { blog: 'article', youtube: 'video', podcast: 'microphone', film: 'film', book: 'book', documentation: 'documentation', repository: 'repository', social: 'message', other: 'link' } as const satisfies Record<ResourceType, InstanceType<typeof Icon>['$props']['name']>
</script>
<template><Icon :name="icons[type]" /></template>
