/** Extract a video identity only from supported YouTube URL shapes. */
export function youtubeVideoId(sourceUrl?: string): string | undefined {
  if (!sourceUrl) return
  try {
    const url = new URL(sourceUrl)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return
    const parts = url.pathname.split('/').filter(Boolean)
    const id = ['youtu.be', 'www.youtu.be'].includes(url.hostname) ? parts[0]
      : ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)
        ? parts[0] === 'watch' ? url.searchParams.get('v') : ['embed', 'shorts', 'live'].includes(parts[0] ?? '') ? parts[1] : undefined
        : undefined
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : undefined
  } catch { return }
}
