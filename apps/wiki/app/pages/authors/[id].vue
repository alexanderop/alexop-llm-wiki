<script setup lang="ts">
import { contributorsFor } from '#shared/wiki'
const { t, formatDate } = useI18n()
const route = useRoute()
const wiki = await useWiki()
const author = computed(() => wiki.value.author(String(route.params.id)))
if (!author.value) throw createError({ statusCode: 404, statusMessage: t('authorMissing') })
useSeoMeta({ title: () => `${author.value?.name} · ${t('authors')} · alexop-llm-wiki` })
</script>
<template>
  <WikiShell><div v-if="author" class="library-page authors-page">
    <NuxtLink to="/authors" class="text-link">← {{ t('authors') }}</NuxtLink>
    <header class="author-heading"><AuthorAvatar :name="author.name" :src="author.profile?.avatar" /><h1>{{ author.name }}</h1></header>
    <a v-if="author.url" class="text-link" :href="author.url" target="_blank" rel="noopener noreferrer">{{ t('authorWebsite') }} ↗</a>
    <p v-if="author.profile?.bio" class="author-bio">{{ author.profile.bio }}</p>
    <nav v-if="author.profile?.links.length" class="author-socials" :aria-label="t('authorLinks')">
      <a v-for="link in author.profile.links" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }} ↗</a>
    </nav>
    <NuxtLink :to="{ path: '/', query: { author: author.id } }" class="text-link">{{ t('filterByAuthor') }} →</NuxtLink>
    <details v-if="author.profile" class="profile-evidence">
      <summary>{{ t('profileSources') }} · {{ formatDate(author.profile.updated) }}</summary>
      <ul><li v-for="source in author.profile.sources" :key="source.url"><a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }}</a></li>
      <li v-if="author.profile.avatarSource"><a :href="author.profile.avatarSource" target="_blank" rel="noopener noreferrer">{{ t('avatarSource') }}</a></li></ul>
    </details>
    <section class="author-resources" aria-labelledby="author-resources-heading">
      <div class="section-heading"><h2 id="author-resources-heading">{{ t('authorResources', { name: author.name }) }}</h2><span class="eyebrow">{{ t('authorCount', { count: author.resources.length }) }}</span></div>
      <div class="note-grid"><div v-for="note in author.resources" :key="note.noteId"><p class="eyebrow">{{ contributorsFor(note).find(credit => credit.id === author!.id)?.roles.map(role => t(`credit_${role}`)).join(' · ') }}</p><NoteCard :note="note" /></div></div>
    </section>
  </div></WikiShell>
</template>
