import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleArchive, ArticleView } from '@/components/ArticleView'
import { JsonLd } from '@/components/JsonLd'
import { getArticleBySlug, getArticles } from '@/lib/data'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { FIRM_NAME, SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
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
