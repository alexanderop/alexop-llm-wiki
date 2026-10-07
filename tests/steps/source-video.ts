import { readdir, readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { compiledNoteSchema } from '../../apps/wiki/shared/wiki'
const { Then } = createBdd()

Then('YouTube source pages offer a video before the notes and an offline fallback', async ({ page, context }) => {
  // Verify our player integration without making this scenario depend on YouTube availability.
  await page.route('https://www.youtube-nocookie.com/embed/**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><title>Video provider fixture</title><body>Video provider</body></html>' }))
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  for (const file of files) {
    const note = compiledNoteSchema.parse(JSON.parse(await readFile(`apps/wiki/.generated/public/${file}`, 'utf8')))
    if (note.kind !== 'source' || !note.sourceUrl) continue
    const url = new URL(note.sourceUrl)
    if (!['www.youtube.com', 'youtube.com', 'youtu.be'].includes(url.hostname)) continue
    const videoId = url.searchParams.get('v') ?? url.pathname.split('/').filter(Boolean).at(-1)
    if (!videoId || !/^[\w-]{11}$/.test(videoId)) continue
    await page.goto(`./notes/${note.noteId}`)
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
    await page.getByRole('button', { name: `Play YouTube video: ${note.title}` }).click()
    const frame = page.locator('.source-video iframe')
    await expect(frame).toHaveAttribute('title', `YouTube video: ${note.title}`)
    await expect(frame).toHaveAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&autoplay=1`)
    expect(await frame.evaluate(element => Boolean(element.compareDocumentPosition(document.querySelector('.prose')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true)
    await context.setOffline(true)
    await expect(page.getByText('Connect to the internet to watch this video.')).toBeVisible()
    await expect(frame).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Watch on YouTube ↗' })).toHaveAttribute('href', `https://www.youtube.com/watch?v=${videoId}`)
    await context.setOffline(false)
    await expect(page.getByRole('button', { name: `Play YouTube video: ${note.title}` })).toBeVisible()
  }
})
