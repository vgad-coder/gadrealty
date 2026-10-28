import { InquiryForm } from '@/components/InquiryForm'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Sell with Us',
  description:
    'Sell or rent your New York home with Gad Realty NYC. A broker who is also a construction manager, from the first walk-through to closing. Request a valuation.',
  path: '/sell-with-us',
})

export default async function SellPage() {
  const { locale, t } = await getText()
  const site = await getSite(locale)

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">{t.sell.title}</h1>
        <p className="section-head__standfirst">{t.sell.standfirst}</p>
      </header>

      <section className="sell-intro">
        {t.sell.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="block" aria-labelledby="how-we-work">
        <h2 id="how-we-work" className="block__title">
          {t.sell.stepsTitle}
        </h2>
        <ol className="steps">
          {t.sell.steps.map((step) => (
            <li key={step.title} className="step">
              <div>
                <h3 className="step__title">{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <blockquote className="statement sell-quote">
        <p className="statement__text">“{t.sell.quote}”</p>
      </blockquote>

      <section id="valuation" className="block inquiry" aria-labelledby="valuation-title" style={{ borderTop: 0 }}>
        <h2 id="valuation-title" className="inquiry__title">
          {t.sell.valuationTitle}
        </h2>
        <p className="inquiry__lead">{t.sell.valuationLead}</p>
        <InquiryForm kind="valuation" labels={t.form} askAddress />
        <p className="form__note" style={{ marginTop: '1.5rem' }}>
          {t.sell.phoneLine} <a href={site.phoneHref}>{site.phone}</a> · <a href={`mailto:${site.email}`}>{site.email}</a> · {site.address}
        </p>
      </section>
    </main>
  )
}
