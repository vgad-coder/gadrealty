/** Only ordinary web addresses are ever linked to or accepted. Anything else (javascript:, data:) is refused. */
export function webUrl(value: string | null | undefined): string | null {
  const text = value?.trim()
  if (!text) return null
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

/** For the back office: true when empty or a usable web address. */
export function validateWebUrl(value: string | null | undefined): true | string {
  if (!value?.trim()) return true
  return webUrl(value) ? true : 'Please paste a web address, for example https://streeteasy.com/building/...'
}
