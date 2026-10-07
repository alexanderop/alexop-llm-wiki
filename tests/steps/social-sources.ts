import { readdir, readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { compiledNoteSchema } from '../../apps/wiki/shared/wiki'
const { Then } = createBdd()

Then('saved social posts can be filtered and found by their source URL', async ({ page }) => {
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  const notes = await Promise.all(files.map(async file => compiledNoteSchema.parse(JSON.parse(await readFile(`apps/wiki/.generated/public/${file}`, 'utf8')))))
  const posts = notes.filter(note => note.kind === 'source' && note.resourceType === 'social')
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  await page.getByRole('button', { name: /^Sources\s*\d+$/ }).click()
  await page.getByRole('button', { name: /^Social posts\s*\d+$/ }).click()
  await expect(page.locator('.note-card')).toHaveCount(posts.length)
  for (const post of posts) await expect(page.locator('.note-card').filter({ hasText: post.title })).toBeVisible()
  for (const post of posts) {
    if (!post.sourceUrl) continue
    await page.getByRole('button', { name: /Find a thought/ }).click()
    await page.locator('#wiki-search').fill(post.sourceUrl)
    await page.locator('.search-results').getByRole('link').filter({ hasText: post.title }).click()
    await expect(page.getByRole('heading', { name: post.title, exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /Open original source/ })).toHaveAttribute('href', post.sourceUrl)
    if (['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com'].includes(new URL(post.sourceUrl).hostname)) {
      await expect(page.locator('.article-header > .eyebrow')).toContainText('X / Tweet')
    }
    for (const target of new Set(post.relations.map(relation => relation.target))) {
      await expect(page.locator(`.context-links a[href$="/notes/${target}"]`)).toBeVisible()
    }
  }
})
