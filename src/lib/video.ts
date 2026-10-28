export type Film =
  | { kind: 'embed'; embedUrl: string; posterUrl?: string }
  | { kind: 'file'; fileUrl: string }

/**
 * Accepts what an agent is likely to paste: a YouTube or Vimeo link, a Mux
 * playback id written as mux:ID, or a direct .mp4 link.
 */
export function parseFilm(raw: string | null | undefined): Film | null {
  const value = raw?.trim()
  if (!value) return null

  if (value.toLowerCase().startsWith('mux:')) {
    const id = value.slice(4).trim()
    if (!id) return null
    return {
      kind: 'embed',
      embedUrl: `https://player.mux.com/${encodeURIComponent(id)}?autoplay=true`,
      posterUrl: `https://image.mux.com/${encodeURIComponent(id)}/thumbnail.jpg?width=1600`,
    }
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1)
    if (id) return youtube(id)
  }
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const fromQuery = url.searchParams.get('v')
    if (fromQuery) return youtube(fromQuery)
    const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)
    if (match) return youtube(match[1])
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const match = url.pathname.match(/(\d{6,})/)
    if (match) return { kind: 'embed', embedUrl: `https://player.vimeo.com/video/${match[1]}?autoplay=1` }
  }
  if (/\.(mp4|webm|mov)$/i.test(url.pathname)) return { kind: 'file', fileUrl: url.toString() }

  return null
}

function youtube(id: string): Film {
  return {
    kind: 'embed',
    embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`,
    posterUrl: `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`,
  }
}
