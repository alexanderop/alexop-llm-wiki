import { mkdtemp, mkdir, writeFile, readFile, rm, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const exec = promisify(execFile)
const inspector = resolve('.agents/skills/wiki-extract-source/scripts/inspect-source.mjs')
const compiler = resolve('apps/wiki/scripts/compile-wiki.ts')
const roots = new WeakMap<Page, string>()
const { Given, Then, After } = createBdd()
const source = `---\nnoteId: existing-video\ntitle: Existing video\ndescription: A synthetic source for agent validation.\nkind: source\nresourceType: youtube\nsourceUrl: https://www.youtube.com/watch?v=abcdefghijk\nupdated: 2026-10-04\ndemo: false\n---\nPersonal annotation that must survive duplicate inspection.\n`
Given('an isolated wiki with an existing video source', async ({ page }) => {
  const root = await mkdtemp(join(tmpdir(), 'wiki-agent-'))
  roots.set(page, root)
  for (const folder of ['public']) await mkdir(join(root, 'apps/wiki/content', folder), { recursive: true })
  await writeFile(join(root, 'apps/wiki/content/public/existing-video.md'), source)
})
After('@wiki-agent', async ({ page }) => { const root = roots.get(page); if (root) await rm(root, { recursive: true, force: true }) })
async function inspect(page: Page, url: string, evidence?: string) {
  const root = roots.get(page)!
  const { stdout } = await exec(process.execPath, [inspector, '--root', root, '--url', url, ...(evidence ? ['--evidence', evidence] : [])])
  return JSON.parse(stdout)
}
Then('alternate video URLs identify the existing source without modifying it', async ({ page }) => {
  for (const url of ['https://youtu.be/abcdefghijk?t=60', 'https://www.youtube.com/shorts/abcdefghijk', 'https://m.youtube.com/watch?v=abcdefghijk&utm_source=test']) {
    const result = await inspect(page, url)
    expect(result.key).toBe('youtube:abcdefghijk')
    expect(result.action).toBe('review-existing')
    expect(result.matches).toEqual([{ noteId: 'existing-video', title: 'Existing video', path: 'apps/wiki/content/public/existing-video.md' }])
  }
  const directory = join(roots.get(page)!, 'apps/wiki/content/public')
  expect(await readdir(directory)).toEqual(['existing-video.md'])
  expect(await readFile(join(directory, 'existing-video.md'), 'utf8')).toBe(source)
})
Then('a source without evidence is pending and an empty transcript is not evidence', async ({ page }) => {
  expect(await inspect(page, 'https://youtu.be/lmnopqrstuv')).toMatchObject({ evidence: 'missing', analysis: 'pending', action: 'new-source' })
  await writeFile(join(roots.get(page)!, 'empty.txt'), ' \n')
  expect(await inspect(page, 'https://youtu.be/lmnopqrstuv', 'empty.txt')).toMatchObject({ evidence: 'empty', analysis: 'pending' })
})
Then('supplied evidence is available without claiming it has been verified', async ({ page }) => {
  await writeFile(join(roots.get(page)!, 'transcript.txt'), 'A synthetic excerpt with limited coverage.')
  expect(await inspect(page, 'https://youtu.be/abcdefghijk', 'transcript.txt')).toMatchObject({ evidence: 'available', analysis: 'inspect-evidence' })
})
Then('tracking parameters are ignored but distinct article identifiers are preserved', async ({ page }) => {
  const first = await inspect(page, 'https://example.com/article?id=1&utm_source=feed#section')
  const same = await inspect(page, 'https://example.com/article?id=1')
  const other = await inspect(page, 'https://example.com/article?id=2')
  expect(first.key).toBe(same.key)
  expect(first.key).not.toBe(other.key)
  expect((await inspect(page, 'https://example.com/#/article/1')).key).toContain('#/article/1')
})
Then('a note referencing a missing source fails compilation', async ({ page }) => {
  const app = join(roots.get(page)!, 'apps/wiki')
  await writeFile(join(app, 'content/public/broken-note.md'), source.replaceAll('existing-video', 'broken-note') + '\n[Missing source](/notes/missing-source)\n')
  await expect(exec(process.execPath, [compiler], { cwd: app })).rejects.toMatchObject({ stderr: expect.stringContaining('unresolved target missing-source') })
})

Then('profiles enrich sources and reject unsafe portrait paths', async ({ page }) => {
  const app = join(roots.get(page)!, 'apps/wiki')
  await writeFile(join(app, 'content/public/existing-video.md'), source.replace('kind: source', 'kind: source\ncontributors:\n  - id: sample-author\n    name: Sample Author\n    roles: [author]'))
  const compile = () => exec(process.execPath, [compiler], { cwd: app })
  await compile()
  const data = () => readFile(join(app, '.generated/public/existing-video.json'), 'utf8').then(JSON.parse)
  expect((await data()).authorProfiles).toEqual([])
  await mkdir(join(app, 'content/public/authors'))
  const profile = `---\nid: sample-author\nname: Sample Author\nbio: A sample biography.\nsources:\n  - label: Official\n    url: https://example.com/\nupdated: 2026-10-05\n---\n`
  await writeFile(join(app, 'content/public/authors/sample-author.md'), profile)
  await compile()
  expect((await data()).authorProfiles[0].bio).toBe('A sample biography.')
  await writeFile(join(app, 'content/public/authors/sample-author.md'), profile.replace('bio:', 'avatar: ../outside.png\nbio:'))
  await expect(compile()).rejects.toThrow()
})

Then('alternate social URLs identify the existing post without merging different posts', async ({ page }) => {
  const root = roots.get(page)!
  await writeFile(join(root, 'apps/wiki/content/public/existing-post.md'), source.replaceAll('existing-video', 'existing-post').replace('resourceType: youtube', 'resourceType: social').replace('https://www.youtube.com/watch?v=abcdefghijk', 'https://twitter.com/example/status/123456789'))
  for (const url of ['https://x.com/example/status/123456789?s=20', 'https://mobile.twitter.com/example/status/123456789/photo/1', 'https://www.x.com/newhandle/status/123456789']) {
    const result = await inspect(page, url)
    expect(result.key).toBe('x:123456789')
    expect(result.playbook).toBe('ingest-social')
    expect(result.action).toBe('review-existing')
    expect(result.matches.map((match: { noteId: string }) => match.noteId)).toEqual(['existing-post'])
  }
  expect((await inspect(page, 'https://x.com/example/status/123456780')).action).toBe('new-source')
  expect((await inspect(page, 'https://x.com.evil.example/example/status/123456789')).action).toBe('new-source')
})

const repositorySource = source.replaceAll('existing-video', 'existing-repository').replace('resourceType: youtube', 'resourceType: repository').replace('https://www.youtube.com/watch?v=abcdefghijk', 'https://github.com/example/project')
Then('alternate repository URLs identify the existing repository without modifying it', async ({ page }) => {
  const directory = join(roots.get(page)!, 'apps/wiki/content/public')
  await writeFile(join(directory, 'existing-repository.md'), repositorySource)
  for (const url of ['https://github.com/Example/Project.git', 'https://www.github.com/EXAMPLE/project/?tab=readme-ov-file#readme', 'https://github.com/example/project#/', 'https://github.com/example/project?ref=main']) {
    const result = await inspect(page, url)
    expect(result).toMatchObject({ key: 'github:example/project', canonicalUrl: 'https://github.com/example/project', playbook: 'ingest-repository', action: 'review-existing' })
    expect(result.matches.map((match: { noteId: string }) => match.noteId)).toEqual(['existing-repository'])
  }
  expect((await readdir(directory)).sort()).toEqual(['existing-repository.md', 'existing-video.md'])
  expect(await readFile(join(directory, 'existing-repository.md'), 'utf8')).toBe(repositorySource)
})
Then('repository deep links and unrelated GitHub routes remain distinct sources', async ({ page }) => {
  const urls = ['https://github.com/example/another-project', 'https://github.com/example/project/issues/1', 'https://github.com/example/project/issues/2', 'https://github.com/example/project/blob/main/README.md', 'https://github.com/example/project/tree/main', 'https://github.com/example/project/pull/1', 'https://github.com/example/project/releases', 'https://github.com/example/project/discussions/1', 'https://github.com/topics/vue', 'https://github.com/orgs/example', 'https://github.com/settings/profile', 'https://github.com.evil.example/example/project']
  const results = await Promise.all(urls.map(url => inspect(page, url)))
  for (const result of results) expect(result.action).toBe('new-source')
  for (const result of results.slice(1)) expect(result.playbook).not.toBe('ingest-repository')
  expect(new Set(results.map(result => result.key)).size).toBe(urls.length)
})
Then('repository sources compile into the collection', async ({ page }) => {
  const app = join(roots.get(page)!, 'apps/wiki')
  await exec(process.execPath, [compiler], { cwd: app })
  const saved = JSON.parse(await readFile(join(app, '.generated/public/existing-repository.json'), 'utf8'))
  expect(saved).toMatchObject({ resourceType: 'repository', sourceUrl: 'https://github.com/example/project' })
  expect(saved.markdown).toContain('Personal annotation that must survive duplicate inspection.')
})
