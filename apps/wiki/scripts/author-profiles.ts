import { readdir, readFile, lstat } from 'node:fs/promises'
import { join } from 'node:path'
import { parseMarkdown } from 'comark'
import { authorProfileSchema, compiledAuthorProfileSchema, type AuthorProfile } from '../shared/wiki.ts'

export async function readAuthorProfiles(): Promise<Map<string, AuthorProfile>> {
  const profiles = new Map<string, AuthorProfile>()
  for (const folder of ['public']) {
    const directory = join('content', folder, 'authors')
    const info = await lstat(directory).catch((error: NodeJS.ErrnoException) => { if (error.code !== 'ENOENT') throw error })
    if (!info) continue
    if (info.isSymbolicLink() || !info.isDirectory()) throw new Error(`Invalid author directory: ${directory}`)
    for (const file of await readdir(directory, { withFileTypes: true })) {
      if (file.isSymbolicLink()) throw new Error(`Author symlink not allowed: ${file.name}`)
      if (!file.isFile() || !file.name.endsWith('.md')) continue
      const document = await parseMarkdown(await readFile(join(directory, file.name), 'utf8'))
      const profile = authorProfileSchema.parse(document.frontmatter)
      if (file.name !== `${profile.id}.md`) throw new Error(`Author filename must match id: ${file.name}`)
      if (profiles.has(profile.id)) throw new Error(`Duplicate author profile: ${profile.id}`)
      let avatar: string | undefined
      if (profile.avatar) {
        if (!profile.avatarSource) throw new Error(`Avatar requires source attribution: ${profile.id}`)
        const path = join(directory, profile.avatar)
        const imageInfo = await lstat(path)
        if (imageInfo.isSymbolicLink() || !imageInfo.isFile() || imageInfo.size > 100_000) throw new Error(`Invalid author image: ${path}`)
        const bytes = await readFile(path)
        const mime = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png'
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'jpeg'
          : bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' ? 'webp' : undefined
        if (!mime) throw new Error(`Unsupported author image: ${path}`)
        avatar = `data:image/${mime};base64,${bytes.toString('base64')}`
      }
      profiles.set(profile.id, compiledAuthorProfileSchema.parse({ ...profile, avatar }))
    }
  }
  return profiles
}
