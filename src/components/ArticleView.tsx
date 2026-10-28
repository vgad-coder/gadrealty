import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { toPicture } from '@/lib/media'
import type { Article } from '@/payload-types'

import { Newsprint } from './Photo'
import { RichBody } from './Prose'

/** A tip or article laid out like a magazine page: tag, big italic headline, two columns, one photograph. */
export function ArticleView({ article, t, locale }: { article: Article; t: Dictionary; locale: Locale }) {
  const author = article.author && typeof article.author === 'object' ? article.author : null
  const hasPhoto = Boolean(toPicture(article.heroImage))
  const tag =
    article.kind === 'tip' && article.tipNumber ? `${t.tip.tipNo} ${article.tipNumber}` : article.kind === 'tip' ? t.tip.title : t.tip.article

  return (
    <article>
      <header className="tip__head">
        <span className="tag">{tag}</span>
        <h1 className="tip__headline">{article.title}</h1>
        <p className="tip__meta">
          {article.publishedOn ? formatDate(article.publishedOn, locale) : null}
          {author ? ` · ${t.tip.by} ${author.name}` : null}
        </p>
      </header>
      <hr className="tip__rule" />

      <div className={`tip__layout${hasPhoto ? '' : ' tip__layout--solo'}`}>
        <RichBody data={article.body as never} className="columns-2 dropcap" />
        {hasPhoto ? (
          <figure>
            <div className="frame">
              <Newsprint
                media={article.heroImage}
                alt={article.caption || article.title}
                ratio="4x3"
                sizes="(min-width: 1000px) 400px, 100vw"
                placeholderLabel={t.placeholder.photoSoon}
              />
            </div>
            {article.caption ? <figcaption className="caption">{article.caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </article>
  )
}

/** Older tips and articles as dated headlines. */
export function ArticleArchive({
  items,
  t,
  locale,
}: {
  items: Article[]
  t: Dictionary
  locale: Locale
}) {
  if (!items.length) return null
  return (
    <section className="archive" aria-labelledby="archive-title">
      <h2 id="archive-title" className="label label--green archive__title">
        {t.tip.earlier}
      </h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="archive__item">
            <span className="archive__date">{item.publishedOn ? formatDate(item.publishedOn, locale, 'short') : ''}</span>
            <Link href={`/tip-of-the-week/${item.slug}`} className="archive__headline">
              {item.kind === 'tip' && item.tipNumber ? `No. ${item.tipNumber} · ` : ''}
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
