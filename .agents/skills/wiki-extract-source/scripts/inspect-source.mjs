import { readdir, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(new URL('../../../../apps/wiki/package.json', import.meta.url))

export function sourceIdentity(input) {
  const url = new URL(input)
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Use an HTTP(S) source URL without credentials')
  const host = url.hostname.toLowerCase()
  const youtube = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'www.youtu.be'].includes(host)
  if (youtube) {
    const parts = url.pathname.split('/').filter(Boolean)
    const id = host.endsWith('youtu.be') ? parts[0] : parts[0] === 'watch' ? url.searchParams.get('v') : ['shorts', 'embed', 'live'].includes(parts[0]) ? parts[1] : undefined
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return { key: `youtube:${id}`, canonicalUrl: `https://www.youtube.com/watch?v=${id}`, playbook: 'ingest-youtube' }
  }
  if (['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com'].includes(host)) {
    const match = url.pathname.match(/^\/([a-zA-Z0-9_]+)\/status\/(\d+)(?:\/(?:photo|video)\/\d+)?\/?$/)
    if (match) return { key: `x:${match[2]}`, canonicalUrl: `https://x.com/${match[1]}/status/${match[2]}`, playbook: 'ingest-social' }
  }
  if (['github.com', 'www.github.com'].includes(host)) {
    const match = url.pathname.match(/^\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/([a-zA-Z0-9_.-]+)\/?$/)
    const reserved = new Set(['about', 'account', 'apps', 'codespaces', 'collections', 'contact', 'customer-stories', 'enterprise', 'events', 'explore', 'features', 'issues', 'login', 'marketplace', 'new', 'notifications', 'orgs', 'organizations', 'pricing', 'pulls', 'readme', 'search', 'security', 'sessions', 'settings', 'site', 'sponsors', 'topics', 'trending', 'users'])
    if (match && !reserved.has(match[1].toLowerCase())) {
      const owner = match[1].toLowerCase()
      const repository = match[2].replace(/\.git$/i, '').toLowerCase()
      if (repository && !['.', '..'].includes(repository)) return { key: `github:${owner}/${repository}`, canonicalUrl: `https://github.com/${owner}/${repository}`, playbook: 'ingest-repository' }
    }
  }
  for (const key of [...url.searchParams.keys()]) if (/^utm_/i.test(key) || ['fbclid', 'gclid'].includes(key)) url.searchParams.delete(key)
  if (!/^#[!/]/.test(url.hash)) url.hash = ''
  url.searchParams.sort()
  return { key: url.href, canonicalUrl: url.href, playbook: youtube ? null : 'ingest-article' }
}

export async function inspectSource({ root = process.cwd(), url, evidence }) {
  const identity = sourceIdentity(url)
  const { parseMarkdown } = await import(pathToFileURL(require.resolve('comark')).href)
  const matches = []
  for (const audience of ['public']) {
    const directory = resolve(root, 'apps/wiki/content', audience)
    let entries
    entries = await readdir(directory, { withFileTypes: true })
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.isSymbolicLink()) throw new Error(`Symlink not allowed: ${entry.name}`)
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue
      const { frontmatter } = await parseMarkdown(await readFile(join(directory, entry.name), 'utf8'))
      if (typeof frontmatter?.sourceUrl !== 'string') continue
      if (sourceIdentity(frontmatter.sourceUrl).key === identity.key) {
        matches.push({ noteId: frontmatter.noteId, title: frontmatter.title, path: `apps/wiki/content/${audience}/${entry.name}` })
      }
    }
  }
  let evidenceStatus = 'missing'
  if (evidence) evidenceStatus = (await readFile(resolve(root, evidence), 'utf8')).trim() ? 'available' : 'empty'
  return { ...identity, matches, evidence: evidenceStatus, action: matches.length ? 'review-existing' : 'new-source', analysis: evidenceStatus === 'available' ? 'inspect-evidence' : 'pending', note: 'Availability is not proof of completeness or accuracy. Confirm medium and inspect evidence before writing.' }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const options = {}
    for (let i = 2; i < process.argv.length; i += 2) {
      const key = process.argv[i]
      const value = process.argv[i + 1]
      if (!['--url', '--root', '--evidence'].includes(key) || !value) throw new Error('Usage: inspect-source.mjs --url URL [--root PATH] [--evidence FILE]')
      options[key.slice(2)] = value
    }
    if (!options.url) throw new Error('--url is required')
    console.log(JSON.stringify(await inspectSource(options), null, 2))
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
