import { readdir, readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { compiledNoteSchema } from '../../apps/wiki/shared/wiki'
const { Then } = createBdd()

Then('authored diagrams use the wiki theme and work offline', async ({ page, context }) => {
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  for (const file of files) {
    const note = compiledNoteSchema.parse(JSON.parse(await readFile(`apps/wiki/.generated/public/${file}`, 'utf8')))
    if (!note.document.includes('"language":"mermaid"')) continue
    await page.goto(`./notes/${note.noteId}`)
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
    const diagrams = page.locator('.wiki-diagram')
    const svg = diagrams.first().locator('svg')
    await expect(svg).toBeVisible()
    await expect(svg).toHaveAttribute('aria-roledescription', /.+/)
    const before = await svg.innerHTML()
    const accent = await page.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--terra').trim())
    expect(before).toContain(accent)
    await page.getByRole('button', { name: /Switch to .* theme/ }).click()
    const nextAccent = await page.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--terra').trim())
    expect(nextAccent).not.toBe(accent)
    await expect.poll(() => svg.innerHTML()).toContain(nextAccent)
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await diagrams.first().getByText('View diagram source', { exact: true }).click()
    await expect(diagrams.first().locator('pre')).toBeVisible()
    await page.evaluate(async () => { await navigator.serviceWorker.ready })
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)
    await context.setOffline(true)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
    await expect(svg).toBeVisible()
    await context.setOffline(false)
  }
})
