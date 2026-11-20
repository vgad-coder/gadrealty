import { ArticleArchive, ArticleView } from '@/components/ArticleView'
import { TipLibrary, TipView } from '@/components/TipView'
import { getArticles } from '@/lib/data'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { tipOfTheWeek } from '@/lib/tips'

export const metadata = pageMetadata({
  title: 'Tip of the Week',
  description: 'A weekly tip on buying, selling, renting and renovating a home in New York, from Gad Realty NYC.',
  path: '/tip-of-the-week',
})

// A new tip takes over every Monday, so this page is built fresh for each visit.
export const dynamic = 'force-dynamic'

const WEEK = 7 * 86_400_000

export default async function TipOfTheWeekPage() {
  const { locale, t } = await getText()
  const articles = await getArticles(locale)

  // A tip written in the back office wins for the week it is published. Otherwise the built-in tip of the week shows.
  const written = articles.find((a) => a.kind === 'tip' && a.publishedOn && Date.now() - Date.parse(a.publishedOn) < WEEK)
  const others = articles.filter((a) => a.id !== written?.id)

  return (
    <main className="page page--narrow">
      {written ? <ArticleView article={written} t={t} locale={locale} /> : <TipView tip={tipOfTheWeek()} t={t} thisWeek />}
      <ArticleArchive items={others} t={t} locale={locale} />
      <TipLibrary t={t} />
    </main>
  )
}
