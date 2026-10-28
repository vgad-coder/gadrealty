import type { Dictionary } from '@/i18n/dictionaries'
import type { Building } from '@/payload-types'

const RATINGS = [
  ['overallRating', 'building'] as const,
  ['doormanRating', 'doorman'] as const,
  ['managementRating', 'management'] as const,
  ['lifestyleRating', 'lifestyle'] as const,
]

function Stars({ value }: { value: string }) {
  const n = Number(value)
  return (
    <span className="stars" aria-label={`${n} out of 5`}>
      {'\u2605'.repeat(n)}
      <span className="stars__empty">{'\u2605'.repeat(5 - n)}</span>
    </span>
  )
}

/** Ratings and a fun fact for the building, shown on a home's page. Empty ratings stay hidden. */
export function BuildingNotes({ building, t }: { building: Building; t: Dictionary }) {
  const ratings = RATINGS.filter(([key]) => building[key])
  const hasFact = Boolean(building.funFact?.trim())
  const extras = [building.doormanNote, building.managementCompany, building.lifestyleNote].filter(Boolean)
  if (!ratings.length && !hasFact && !extras.length) return null

  return (
    <aside className="bldg" aria-labelledby="bldg-title">
      <h2 id="bldg-title" className="label label--green bldg__title">
        {t.building.title}
        {building.name ? ` \u00B7 ${building.name}` : ''}
      </h2>
      {ratings.length ? (
        <>
          <p className="bldg__disclaimer">{t.building.disclaimer}</p>
          <dl className="bldg__ratings">
            {ratings.map(([key, label]) => (
              <div key={key} className="bldg__row">
                <dt>{t.building[label]}</dt>
                <dd>
                  <Stars value={building[key] as string} />
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
      {building.doormanNote ? <p className="bldg__note">{building.doormanNote}</p> : null}
      {building.managementCompany ? (
        <p className="bldg__note">
          {t.building.managedBy} {building.managementCompany}
        </p>
      ) : null}
      {building.lifestyleNote ? <p className="bldg__note">{building.lifestyleNote}</p> : null}
      {hasFact ? (
        <p className="bldg__fact">
          <span className="bldg__fact-label">{t.building.funFact}</span> {building.funFact}
        </p>
      ) : null}
    </aside>
  )
}
