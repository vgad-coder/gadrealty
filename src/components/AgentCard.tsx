import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries'
import type { Agent } from '@/payload-types'

import { Polaroid } from './Polaroid'

export function AgentCard({ agent, t, index = 0 }: { agent: Agent; t: Dictionary; index?: number }) {
  const languages = (agent.languages ?? []).filter(Boolean)
  return (
    <article className="agent">
      <Polaroid media={agent.portrait} alt={agent.name} portrait tilt={index % 2 ? 1.6 : -1.6} sizes="260px" placeholderLabel={t.office.portraitSoon} />
      <div>
        <h3 className="agent__name">
          <Link href={`/the-office/${agent.slug}`} style={{ textDecoration: 'none' }}>
            {agent.name}
          </Link>
        </h3>
        {agent.title ? <p className="agent__title">{agent.title}</p> : null}
      </div>
      <div className="agent__meta">
        {languages.length ? (
          <p>
            <span className="label label--soft">{t.office.languages}</span>
            <br />
            {languages.join(', ')}
          </p>
        ) : null}
        {agent.phone ? (
          <p>
            <a href={`tel:${agent.phone.replace(/[^+\d]/g, '')}`}>{agent.phone}</a>
          </p>
        ) : null}
      </div>
      <Link href={`/the-office/${agent.slug}`} className="textlink">
        {t.office.seeHomes}
      </Link>
    </article>
  )
}
