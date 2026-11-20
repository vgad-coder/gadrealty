import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleArchive, ArticleView } from '@/components/ArticleView'
import { JsonLd } from '@/components/JsonLd'
import { TipLibrary, TipView } from '@/components/TipView'
import { getArticleBySlug, getArticles } from '@/lib/data'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { FIRM_NAME, SITE_URL } from '@/lib/site'
import { tipBySlug } from '@/lib/tips'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tip = tipBySlug(slug)
  if (tip) {
    return pageMetadata({
      title: tip.title,
      description: `${tip.body[0]} A tip from ${FIRM_NAME}.`.slice(0, 200),
      path: `/tip-of-the-week/${tip.slug}`,
    })
  }
  const { locale } = await getText()
  const article = await getArticleBySlug(slug, locale)
  if (!article) return { title: 'Not found' }
  return pageMetadata({
    title: article.title,
    description: article.summary?.trim() || `${article.title}. A note from ${FIRM_NAME}.`,
    path: `/tip-of-the-week/${article.slug}`,
    image: article.heroImage,
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const { locale, t } = await getText()

  const tip = tipBySlug(slug)
  if (tip) {
    return (
      <main className="page page--narrow">
        <TipView tip={tip} t={t} />
        <TipLibrary t={t} currentSlug={tip.slug} />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: tip.title,
            url: `${SITE_URL}/tip-of-the-week/${tip.slug}`,
            mainEntityOfPage: `${SITE_URL}/tip-of-the-week/${tip.slug}`,
            description: tip.body[0],
            author: { '@type': 'Organization', name: FIRM_NAME },
            publisher: { '@type': 'Organization', name: FIRM_NAME, url: SITE_URL },
          }}
        />
      </main>
    )
  }

  const article = await getArticleBySlug(slug, locale)
  if (!article) notFound()

  const articles = await getArticles(locale)
  const others = articles.filter((a) => a.id !== article.id)

  return (
    <main className="page">
      <ArticleView article={article} t={t} locale={locale} />
      <ArticleArchive items={others} t={t} locale={locale} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          datePublished: article.publishedOn,
          dateModified: article.updatedAt,
          url: `${SITE_URL}/tip-of-the-week/${article.slug}`,
          mainEntityOfPage: `${SITE_URL}/tip-of-the-week/${article.slug}`,
          description: article.summary ?? undefined,
          author:
            article.author && typeof article.author === 'object'
              ? { '@type': 'Person', name: article.author.name, url: `${SITE_URL}/the-office/${article.author.slug}` }
              : { '@type': 'Organization', name: FIRM_NAME },
          publisher: { '@type': 'Organization', name: FIRM_NAME, url: SITE_URL },
        }}
      />
    </main>
  )
}
