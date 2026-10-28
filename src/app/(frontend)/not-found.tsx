import Link from 'next/link'

import { getText } from '@/lib/locale'

export default async function NotFound() {
  const { t } = await getText()
  return (
    <main className="page">
      <div className="not-found">
        <span className="tag">404</span>
        <h1 className="not-found__title">{t.notFound.title}</h1>
        <p>{t.notFound.text}</p>
        <Link href="/" className="textlink">
          {t.notFound.back}
        </Link>
      </div>
    </main>
  )
}
