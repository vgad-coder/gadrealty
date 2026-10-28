import { Classified } from '@/components/Classified'
import { getAvailableListings } from '@/lib/data'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'For Sale and For Rent',
  description: 'Homes for sale and for rent through Gad Realty NYC in New York City.',
  path: '/available',
})

export default async function AvailablePage() {
  const { locale, t } = await getText()
  const listings = await getAvailableListings()
  const forSale = listings.filter((l) => l.status === 'for-sale')
  const forRent = listings.filter((l) => l.status === 'for-rent')

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">{t.available.title}</h1>
        <p className="section-head__standfirst">{t.available.standfirst}</p>
      </header>

      <div className="available">
        <section className="available__col" aria-labelledby="for-sale">
          <h2 id="for-sale" className="available__heading">
            {t.available.forSale}
          </h2>
          {forSale.length ? (
            <div className="polaroids polaroids--column">
              {forSale.map((l, i) => (
                <Classified key={l.id} listing={l} t={t} locale={locale} index={i} inquire />
              ))}
            </div>
          ) : (
            <p className="empty-note">{t.available.nothingForSale}</p>
          )}
        </section>

        <section className="available__col" aria-labelledby="for-rent">
          <h2 id="for-rent" className="available__heading">
            {t.available.forRent}
          </h2>
          {forRent.length ? (
            <div className="polaroids polaroids--column">
              {forRent.map((l, i) => (
                <Classified key={l.id} listing={l} t={t} locale={locale} index={i + 3} inquire />
              ))}
            </div>
          ) : (
            <p className="empty-note">{t.available.nothingForRent}</p>
          )}
        </section>
      </div>    </main>
  )
}
