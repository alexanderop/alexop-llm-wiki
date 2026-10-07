import { messages, type MessageKey } from '~/i18n'
import type { NoteKind, ResourceType } from '#shared/wiki'

export function useI18n() {
  function t(key: MessageKey, params: Record<string, string | number> = {}) {
    return messages[key].replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match))
  }
  const kindLabel = (kind: NoteKind) => t(kind)
  const resourceLabel = (type: ResourceType = 'other') => t(`resource_${type}`)
  const formatDate = (date: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
  return { t, kindLabel, resourceLabel, formatDate }
}
