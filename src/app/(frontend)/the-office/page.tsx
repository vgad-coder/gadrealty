import Link from 'next/link'

import { AgentCard } from '@/components/AgentCard'
import { InquiryForm } from '@/components/InquiryForm'
import { getAgents } from '@/lib/data'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { getSite } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'The Office',
  description:
    'Gad Realty NYC is a boutique New York brokerage and construction management firm, led by broker Vanessa Gad. Meet our multilingual agents.',
  path: '/the-office',
})

export default async function OfficePage() {
  const { locale, t } = await getText()
  const [site, agents] = await Promise.all([getSite(locale), getAgents(locale)])

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">{t.office.title}</h1>
        <p className="section-head__standfirst">{t.office.standfirst}</p>
      </header>

      <section className="block" aria-label={t.office.title}>
        <div className="prose columns-2 dropcap">
          {site.story.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        {site.ceoQuote ? <p className="quote">“{site.ceoQuote}”</p> : null}
      </section>

      <section className="block" aria-labelledby="construction-management">
        <h2 id="construction-management" className="block__title">
          {t.office.constructionTitle}
        </h2>
        <p className="statement__text" style={{ textAlign: 'start', margin: 0, maxWidth: '52rem' }}>
          {site.constructionLine}
        </p>
        <p className="label label--green" style={{ marginTop: '1.6rem' }}>
          {t.office.jobs}
        </p>
        <ul className="jobs" style={{ marginTop: '0.6rem' }}>
          {site.jobTypes.map((job) => (
            <li key={job}>{job}</li>
          ))}
        </ul>
        <p style={{ marginTop: '1.25rem' }}>
          <Link href="/construction-management" className="textlink">
            Explore Construction Management
          </Link>
        </p>
      </section>

      <section className="block" aria-labelledby="our-agents">
        <h2 id="our-agents" className="block__title">
          {t.office.agents}
        </h2>
        {agents.length ? (
          <div className="agents">
            {agents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} t={t} index={i} />
            ))}
          </div>
        ) : (
          <p className="empty-note">{t.office.noHomes}</p>
        )}
      </section>

      <section className="block" aria-labelledby="find-us">
        <h2 id="find-us" className="block__title">
          {t.office.contactTitle}
        </h2>
        <div className="contact">
          <div>
            <p className="inquiry__lead">{t.office.contactLead}</p>
            <address className="contact__details">
              <p>{site.address}</p>
              <p>
                <a href={site.phoneHref}>{site.phone}</a>
              </p>
              <p>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </address>
          </div>
          <InquiryForm kind="general" labels={t.form} />
        </div>
      </section>
    </main>
  )
}
