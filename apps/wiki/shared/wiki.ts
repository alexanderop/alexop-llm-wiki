import { z } from 'zod'

export const noteKindSchema = z.enum(['source', 'concept', 'insight'])
export const resourceTypes = ['blog', 'youtube', 'podcast', 'film', 'book', 'documentation', 'repository', 'social', 'other'] as const
export const resourceTypeSchema = z.enum(resourceTypes)
export type ResourceType = z.infer<typeof resourceTypeSchema>
export const relationSchema = z.object({ target: z.string(), kind: z.enum(['links', 'builds-on', 'contradicts']) })
export const contributorRoles = ['author', 'host', 'guest', 'editor', 'translator', 'director', 'speaker', 'organization'] as const
export const contributorSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  name: z.string().trim().min(1),
  url: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  roles: z.array(z.enum(contributorRoles)).min(1).default(['author']),
})
export type ContributorRole = typeof contributorRoles[number]
export const noteMetadataSchema = z.object({
  noteId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  description: z.string().min(1),
  kind: noteKindSchema,
  resourceType: resourceTypeSchema.optional(),
  updated: z.iso.date(),
  tags: z.array(z.string()).default([]),
  sourceUrl: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  contributors: z.array(contributorSchema).default([]),
  author: z.string().trim().min(1).optional(),
  authorId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  authorUrl: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  demo: z.boolean().default(true),
  relations: z.array(relationSchema).default([]),
})
const profileLinkSchema = z.object({ label: z.string().trim().min(1), url: z.url().refine(value => /^https?:\/\//.test(value)) })
export const authorProfileSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1),
  bio: z.string().trim().min(1).max(600).optional(),
  url: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  avatar: z.string().regex(/^[a-z0-9-]+\.(?:png|jpg|webp)$/).optional(),
  avatarSource: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  links: z.array(profileLinkSchema).default([]),
  sources: z.array(profileLinkSchema).min(1),
  updated: z.iso.date(),
}).strict()
export const compiledAuthorProfileSchema = authorProfileSchema.omit({ avatar: true }).extend({
  avatar: z.string().regex(/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/).optional(),
})
export type AuthorProfile = z.infer<typeof compiledAuthorProfileSchema>

export const compiledNoteSchema = noteMetadataSchema.extend({
  authorProfiles: z.array(compiledAuthorProfileSchema).default([]),
  document: z.string(),
  markdown: z.string(),
  searchText: z.string(),
  readingMinutes: z.number(),
  headings: z.array(z.object({ id: z.string(), text: z.string(), depth: z.number() })),
})
export type NoteKind = z.infer<typeof noteKindSchema>
export type Note = z.infer<typeof compiledNoteSchema>
export type Relation = z.infer<typeof relationSchema>
export const kindLabels: Record<NoteKind, string> = { source: 'Source', concept: 'Topic', insight: 'Insight' }
export const kindColors: Record<NoteKind, string> = { source: '#698575', concept: '#c16b4e', insight: '#8b80a4' }

export function authorIdFor(note: Pick<Note, 'author' | 'authorId'>): string | undefined {
  if (!note.author) return undefined
  return note.authorId ?? (note.author.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || undefined)
}

export function contributorsFor(note: Pick<Note, 'contributors' | 'author' | 'authorId' | 'authorUrl'>) {
  const credits = note.contributors?.length ? note.contributors : note.author ? [{ id: note.authorId, name: note.author, url: note.authorUrl, roles: ['author'] as ContributorRole[] }] : []
  return credits.map(credit => {
    const id = authorIdFor({ author: credit.name, authorId: credit.id })
    if (!id) throw new Error(`Supply an explicit contributor id for ${credit.name}`)
    return { ...credit, id, roles: [...new Set(credit.roles)] }
  })
}
