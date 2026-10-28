import Link from 'next/link'

import { JsonLd } from '@/components/JsonLd'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { FIRM_NAME, SITE_URL, getSite } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Construction Management in New York City and New Jersey',
  description:
    'From staging and painting to a full gut renovation, Gad Realty helps you decide which changes will make the greatest difference. We manage projects across New York City and New Jersey.',
  path: '/construction-management',
})

const INTRO = [
  'From staging and painting to a full gut renovation, Gad Realty helps you decide which changes will make the greatest difference. We manage projects across New York City and New Jersey, with personal attention to your goals, budget, and timeline.',
  'After 32 years of showing properties and listening to buyers and tenants, we understand what makes them choose one apartment over another and what makes them walk away. We use that experience to guide your improvements, from fresh paint and staging to changes in layout and finishes, so you spend where it matters and give people more reasons to choose your property.',
  'Whether you’re preparing to sell or rent, renovating your own home, or creating a commercial space, we guide you through planning, design, construction, and the finishing touches.',
]

const WORK = [
  'Staging & Painting',
  'Targeted Improvements',
  'Full Gut Renovations',
  'Apartment Combinations',
  'Townhouses',
  'Retail & Commercial Spaces',
]

export default async function ConstructionPage() {
  const { locale } = await getText()
  const site = await getSite(locale)

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">Construction Management</h1>
        <p className="section-head__standfirst">From thoughtful improvements to complete transformations.</p>
      </header>

      <section className="sell-intro">
        {INTRO.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="block" aria-labelledby="the-work">
        <h2 id="the-work" className="block__title">
          The work we manage
        </h2>
        <ul className="jobs jobs--center">
          {WORK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="statement talk" aria-labelledby="start-talking">
        <h2 id="start-talking" className="talk__title">
          Let’s talk about your project
        </h2>
        <div className="talk__buttons">
          <Link href="/the-office#find-us" className="button">
            Contact Us
          </Link>
          <Link href="/sold-and-rented" className="button button--outline">
            See our recent work
          </Link>
        </div>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: `${FIRM_NAME}: Construction Management`,
          url: `${SITE_URL}/construction-management`,
          description:
            'Construction management for staging, painting, targeted improvements, gut renovations, apartment combinations, townhouses, and retail and commercial spaces in New York City and New Jersey.',
          telephone: site.phone,
          email: site.email,
          address: { '@type': 'PostalAddress', streetAddress: site.address, addressCountry: 'US' },
          areaServed: ['New York City', 'New Jersey'],
          serviceType: 'Construction management',
        }}
      />
    </main>
  )
}
