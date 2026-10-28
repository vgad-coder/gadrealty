'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Item = { href: string; label: string }

/** The index under the masthead, like the sections of a newspaper. On a phone it folds into a menu button. */
export function Nav({ items, label }: { items: Item[]; label: string }) {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)

  // Close the menu after going to another page.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className={`nav${open ? ' nav--open' : ''}`} aria-label={label}>
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="site-nav-list"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav__burger" aria-hidden="true" />
        {label}
      </button>
      <ul className="nav__list" id="site-nav-list">
        {items.map((item) => (
          <li key={item.href} className="nav__item">
            <Link
              href={item.href}
              className="nav__link"
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
