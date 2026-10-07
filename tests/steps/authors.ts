import { readdir, readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { contributorsFor, compiledNoteSchema } from '../../apps/wiki/shared/wiki'
import en from '../../apps/wiki/app/i18n/en'

const { When, Then } = createBdd()
async function sources() {
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  return (await Promise.all(files.map(async file => compiledNoteSchema.parse(JSON.parse(await readFile(`apps/wiki/.generated/public/${file}`, 'utf8')))))).filter(note => note.kind === 'source' && contributorsFor(note).length)
}
When('I browse authors from the library', async ({ page }) => {
  await page.getByRole('link', { name: en.authors, exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.authors)
})
Then('author pages contain exactly their published resources', async ({ page }) => {
  const notes = await sources()
  const ids = [...new Set(notes.flatMap(note => contributorsFor(note).map(credit => credit.id)))]
  await expect(page.locator('.author-list li')).toHaveCount(ids.length)
  if (!ids.length) await expect(page.getByRole('status').filter({ hasText: en.noAuthors })).toBeVisible()
  for (const id of ids) {
    const expected = notes.filter(note => contributorsFor(note).some(credit => credit.id === id))
    await page.locator(`.author-list a[href$="/authors/${id}"]`).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(contributorsFor(expected[0]!).find(credit => credit.id === id)!.name)
    const profile = expected.flatMap(note => note.authorProfiles).find(profile => profile.id === id)
    if (profile?.bio) await expect(page.locator('.author-bio')).toHaveText(profile.bio)
    if (profile?.avatar) await expect.poll(() => page.locator('.author-heading img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    for (const link of profile?.links ?? []) await expect(page.getByRole('navigation', { name: en.authorLinks }).getByRole('link', { name: `${link.label} ↗` })).toHaveAttribute('href', link.url)
    await expect(page.locator('.note-card')).toHaveCount(expected.length)
    for (const note of expected) await expect(page.locator('.note-card').getByRole('heading', { name: note.title, exact: true })).toBeVisible()
    const href = await page.locator('.note-card').first().getAttribute('href')
    const selectedNote = expected.find(note => href?.endsWith(`/notes/${note.noteId}`))!
    await page.locator('.note-card').first().click()
    await expect(page.getByRole('article').getByRole('heading', { level: 1 })).toHaveText(selectedNote.title)
    for (const credit of contributorsFor(selectedNote)) {
      const link = page.locator(`.author-link[href$="/authors/${credit.id}"]`)
      await expect(link).toContainText(credit.name)
      for (const role of credit.roles) await expect(link).toContainText(en[`credit_${role}`])
    }
    await page.locator(`.author-link[href$="/authors/${id}"]`).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(contributorsFor(expected[0]!).find(credit => credit.id === id)!.name)
    await page.locator('main').getByRole('link', { name: en.authors }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.authors)
  }
})
Then('the author catalog remains available offline', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.authors)
  const links = page.locator('.author-list a')
  if (await links.count()) {
    await links.first().click()
    await expect(page.locator('.author-resources')).toBeVisible()
    await page.reload()
    await expect(page.locator('.author-resources')).toBeVisible()
    if (await page.locator('.author-heading img').count()) await expect.poll(() => page.locator('.author-heading img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  }
})
When('I open an unknown author', async ({ page }) => {
  const response = await page.goto('./authors/does-not-exist')
  expect(response?.status()).toBe(404)
})

Then('I can filter the library to a contributor\'s resources', async ({ page }) => {
  const notes = await sources()
  const first = notes[0]
  if (!first) { await expect(page.getByLabel(en.authorFilter)).toHaveCount(0); return }
  const credit = contributorsFor(first)[0]!
  const expected = notes.filter(note => contributorsFor(note).some(author => author.id === credit.id))
  await page.getByLabel(en.authorFilter).selectOption(credit.id)
  await expect(page).toHaveURL(new RegExp(`author=${credit.id}`))
  await expect(page.locator('.note-card')).toHaveCount(expected.length)
  for (const note of expected) await expect(page.locator('.note-card').getByRole('heading', { name: note.title, exact: true })).toBeVisible()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.getByLabel(en.authorFilter)).toHaveValue(credit.id)
  await expect(page.locator('.note-card')).toHaveCount(expected.length)
  await page.getByRole('group', { name: en.filterLibrary }).getByRole('button', { name: /^Topics/ }).click()
  await expect(page.locator('.note-card')).toHaveCount(0)
  await page.getByRole('button', { name: /Clear filters/ }).click()
  await expect(page.getByLabel(en.authorFilter)).toHaveValue('')
  await expect(page).not.toHaveURL(/author=/)
})
