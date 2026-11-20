import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries'
import { TIPS, TIP_TOPICS, topicLabel, type Tip } from '@/lib/tips'

/** One tip from the built-in library: tag, headline, a few short paragraphs, and a way to reach us. */
export function TipView({ tip, t, thisWeek = false }: { tip: Tip; t: Dictionary; thisWeek?: boolean }) {
  return (
    <article className="tip">
      <header className="tip__head">
        <span className="tag">{thisWeek ? `${t.tip.tipNo} ${tip.number}` : `${t.tip.thisWeekLabel}, No. ${tip.number}`}</span>
        <h1 className="tip__headline">{tip.title}</h1>
        <p className="tip__meta">{topicLabel(tip.topic)}</p>
      </header>
      <hr className="tip__rule" />
      <div className="tip__text prose">
        {tip.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <p className="tip__ask">
        {t.tip.askUs}{' '}
        <Link href="/the-office#find-us" className="textlink">
          {t.tip.askUsLink}
        </Link>
      </p>
    </article>
  )
}

/** Every tip in the library, grouped by subject. */
export function TipLibrary({ t, currentSlug, only }: { t: Dictionary; currentSlug?: string; only?: string }) {
  const topics = only ? TIP_TOPICS.filter((topic) => topic.id === only) : TIP_TOPICS
  return (
    <section className="tiplib" aria-labelledby="tiplib-title">
      <h2 id="tiplib-title" className="label label--green archive__title">
        {t.tip.browse}
      </h2>
      <p className="tiplib__lead">{t.tip.browseLead}</p>
      <nav className="chips" aria-label={t.tip.browse}>
        {topics.map((topic) => (
          <a key={topic.id} href={`#topic-${topic.id}`} className="chip">
            {topic.label}
          </a>
        ))}
      </nav>
      <div className="tiplib__groups">
        {topics.map((topic) => (
          <div key={topic.id} id={`topic-${topic.id}`} className="tiplib__group">
            <h3 className="tiplib__topic">{topic.label}</h3>
            <ul>
              {TIPS.filter((tip) => tip.topic === topic.id).map((tip) => (
                <li key={tip.slug}>
                  <Link href={`/tip-of-the-week/${tip.slug}`} aria-current={tip.slug === currentSlug ? 'page' : undefined}>
                    {tip.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
