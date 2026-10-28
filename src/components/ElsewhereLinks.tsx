/** Links to the same listings on other websites. They open in a new tab. */
export function ElsewhereLinks({
  links,
  className = '',
  button = false,
}: {
  links: { label: string; url: string }[]
  className?: string
  button?: boolean
}) {
  if (!links.length) return null
  return (
    <span className={`elsewhere ${className}`.trim()}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={button ? 'button button--outline' : 'textlink'}
        >
          {link.label}
        </a>
      ))}
    </span>
  )
}
