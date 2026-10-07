import { readdir } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import en from '../../apps/wiki/app/i18n/en'

const { Given, When, Then } = createBdd()
Given('I open my template wiki', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('commonplace-theme')) localStorage.setItem('commonplace-theme', 'dark')
  })
  await page.goto('./')
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('main').getByRole('heading', { level: 1 })).toBeVisible()
})
Then('the library reflects my Markdown files', async ({ page }) => {
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  await expect(page.locator('.note-grid').getByRole('link')).toHaveCount(files.length)
})
Then('I can find and read an available note', async ({ page }) => {
  const cards = page.locator('.note-grid').getByRole('link')
  const count = await cards.count()
  const title = count ? await cards.first().getByRole('heading').innerText() : 'no-notes-yet'
  await page.getByRole('button').filter({ hasText: en.findThoughts }).click()
  await page.getByRole('textbox', { name: en.searchLabel }).fill(title)
  const dialog = page.getByRole('dialog')
  if (!count) { await expect(dialog.getByText(en.emptySearch)).toBeVisible(); return }
  await dialog.getByRole('link').filter({ has: page.getByText(title, { exact: true }) }).first().click()
  await expect(page.getByRole('article').getByRole('heading', { level: 1 })).toHaveText(title)
})
When('I take the template offline', async ({ page, context }) => {
  await expect(page.getByText(en.offlineReady, { exact: true })).toBeVisible({ timeout: 30000 })
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)
  await context.setOffline(true)
  await page.reload()
})
Then('the template and graph work without a network', async ({ page }) => {
  await expect(page.getByRole('heading', { name: en.inLibrary })).toBeVisible()
  await page.getByRole('navigation', { name: en.navigation }).getByRole('link').filter({ hasText: en.graph }).click()
  await expect(page.locator('.full-graph canvas')).toBeVisible()
  await page.getByRole('button').filter({ hasText: en.findThoughts }).click()
  await expect(page.getByRole('textbox', { name: en.searchLabel })).toBeFocused()
})
When('I change the template appearance', async ({ page }) => {
  await page.getByRole('button', { name: en.lightTheme }).click()
  await page.reload()
})
Then('the template remembers my choices after reload', async ({ page }) => {
  await expect(page.getByRole('button', { name: en.darkTheme })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
When('I open and close template search with the keyboard', async ({ page }) => {
  const trigger = page.getByRole('button').filter({ hasText: en.findThoughts })
  await trigger.focus()
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByRole('textbox', { name: en.searchLabel })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})
Then('focus returns to the template search button', async ({ page }) => {
  await expect(page.getByRole('button').filter({ hasText: en.findThoughts })).toBeFocused()
})

Given('my browser previously preferred German', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('commonplace-locale', 'de'))
})
When('I view the wiki at {int} pixels wide', async ({ page }, width: number) => {
  await page.setViewportSize({ width, height: 900 })
  if (width < 681) await page.getByRole('button', { name: en.menu, exact: true }).click()
})
Then('the wiki uses English without a language selector', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('main h1')).toHaveText('Good ideas.New connections.')
  await expect(page.getByRole('combobox', { name: /language|sprache/i })).toHaveCount(0)
  if (await page.getByRole('dialog').isVisible()) {
    await expect(page.getByRole('navigation', { name: en.notes })).toBeVisible()
  }
})
