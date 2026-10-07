<script setup lang="ts">
const { t } = useI18n()
const wiki = await useWiki()
useSeoMeta({ title: () => `${t('authors')} · alexop-llm-wiki` })
</script>
<template>
  <WikiShell><div class="library-page authors-page">
    <div class="page-kicker eyebrow">{{ t('library') }}</div>
    <h1>{{ t('authors') }}</h1><p class="article-description">{{ t('authorsIntro') }}</p>
    <ul v-if="wiki.authors.length" class="author-list">
      <li v-for="author in wiki.authors" :key="author.id"><NuxtLink :to="`/authors/${author.id}`">
        <AuthorAvatar :name="author.name" :src="author.profile?.avatar" />
        <span><strong>{{ author.name }}</strong><span v-if="author.profile?.bio" class="author-summary">{{ author.profile.bio }}</span><span class="eyebrow">{{ t('authorCount', { count: author.resources.length }) }}</span></span><span aria-hidden="true">↗</span>
      </NuxtLink></li>
    </ul><p v-else role="status">{{ t('noAuthors') }}</p>
  </div></WikiShell>
</template>
