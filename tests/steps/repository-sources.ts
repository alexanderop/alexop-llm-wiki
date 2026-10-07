import { readdir, readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { compiledNoteSchema } from '../../apps/wiki/shared/wiki'
const { Then } = createBdd()

Then('saved repositories can be filtered and found by their source URL', async ({ page }) => {
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  const notes = await Promise.all(files.map(async file => compiledNoteSchema.parse(JSON.parse(await readFile(`apps/wiki/.generated/public/${file}`, 'utf8')))))
  const repositories = notes.filter(note => note.kind === 'source' && note.resourceType === 'repository')
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  await page.getByRole('button', { name: /^Sources\s*\d+$/ }).click()
  await page.getByRole('button', { name: /^Repositories\s*\d+$/ }).click()
  await expect(page.locator('.note-card')).toHaveCount(repositories.length)
  for (const repository of repositories) await expect(page.locator('.note-card').filter({ hasText: repository.title })).toBeVisible()
  for (const repository of repositories) {
    if (!repository.sourceUrl) continue
    await page.getByRole('button', { name: /Find a thought/ }).click()
    await page.locator('#wiki-search').fill(repository.sourceUrl)
    await page.locator('.search-results').getByRole('link').filter({ hasText: repository.title }).click()
    await expect(page.getByRole('heading', { name: repository.title, exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /Open original source/ })).toHaveAttribute('href', repository.sourceUrl)
    await expect(page.locator('.article-header > .eyebrow')).toContainText('Repositories')
    for (const target of new Set(repository.relations.map(relation => relation.target))) {
      await expect(page.locator(`.context-links a[href$="/notes/${target}"]`)).toBeVisible()
    }
  }
})
