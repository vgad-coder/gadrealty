import { ArticleArchive, ArticleView } from '@/components/ArticleView'
import { getArticles } from '@/lib/data'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Tip of the Week',
  description: 'A weekly tip on buying, selling, renting and renovating a home in New York, from Gad Realty NYC.',
  path: '/tip-of-the-week',
})

export default async function TipOfTheWeekPage() {
  const { locale, t } = await getText()
  const articles = await getArticles(locale)
  const latest = articles.find((a) => a.kind === 'tip') ?? articles[0]
  const others = articles.filter((a) => a.id !== latest?.id)

  return (
    <main className="page">
      {latest ? (
        <ArticleView article={latest} t={t} locale={locale} />
      ) : (
        <header className="section-head">
          <h1 className="section-head__title">{t.tip.title}</h1>
          <p className="section-head__standfirst">{t.tip.noTips}</p>
        </header>
      )}
      <ArticleArchive items={others} t={t} locale={locale} />
    </main>
  )
}
