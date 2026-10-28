import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Classified } from '@/components/Classified'
import { Polaroid } from '@/components/Polaroid'
import { Paragraphs } from '@/components/Prose'
import { agentIdOf, getAgentBySlug, getAvailableListings, getClosedListings } from '@/lib/data'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { FIRM_NAME } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale } = await getText()
  const agent = await getAgentBySlug(slug, locale)
  if (!agent) return { title: 'Not found' }
  return pageMetadata({
    title: agent.name,
    description: `${agent.name}${agent.title ? `, ${agent.title}` : ''}, at ${FIRM_NAME}.`,
    path: `/the-office/${agent.slug}`,
    image: agent.portrait,
  })
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params
  const { locale, t } = await getText()
  const agent = await getAgentBySlug(slug, locale)
  if (!agent) notFound()

  const [closed, available] = await Promise.all([getClosedListings(), getAvailableListings()])
  const homes = [...available, ...closed].filter((l) => agentIdOf(l) === agent.id)
  const languages = (agent.languages ?? []).filter(Boolean)

  return (
    <main className="page">
      <header className="section-head">
        <div className="agent" style={{ marginBottom: '1rem' }}>
          <Polaroid media={agent.portrait} alt={agent.name} portrait tilt={-1.6} sizes="260px" placeholderLabel={t.office.portraitSoon} />
        </div>
        <h1 className="section-head__title">{agent.name}</h1>
        {agent.title ? <p className="section-head__standfirst">{agent.title}</p> : null}
        <p className="agent__meta" style={{ marginTop: '0.9rem' }}>
          {languages.length ? (
            <span>
              {t.office.languages}: {languages.join(', ')}
            </span>
          ) : null}
          {agent.phone ? (
            <span>
              <a href={`tel:${agent.phone.replace(/[^+\d]/g, '')}`}>{agent.phone}</a>
            </span>
          ) : null}
          {agent.email ? (
            <span>
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
            </span>
          ) : null}
        </p>
      </header>

      {agent.bio ? (
        <section className="block" aria-label={agent.name}>
          <Paragraphs text={agent.bio} className="columns-2 dropcap" />
        </section>
      ) : null}

      <section className="block" aria-labelledby="agent-homes">
        <h2 id="agent-homes" className="block__title">
          {t.office.byAgent} {agent.name}
        </h2>
        {homes.length ? (
          <div className="classifieds">
            {homes.map((listing) => (
              <Classified key={listing.id} listing={listing} t={t} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="empty-note">{t.office.noHomes}</p>
        )}
      </section>
    </main>
  )
}
