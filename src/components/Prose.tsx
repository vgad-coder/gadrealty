import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { paragraphs } from '@/lib/format'

/** Plain text from a back-end text box: a blank line starts a new paragraph. */
export function Paragraphs({
  text,
  className = '',
}: {
  text: string | null | undefined
  className?: string
}) {
  const items = paragraphs(text)
  if (!items.length) return null
  return (
    <div className={`prose ${className}`.trim()}>
      {items.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

/** The formatted body of a tip or article. */
export function RichBody({
  data,
  className = '',
}: {
  data: SerializedEditorState | null | undefined
  className?: string
}) {
  if (!data) return null
  return <RichText data={data} className={`prose ${className}`.trim()} />
}
