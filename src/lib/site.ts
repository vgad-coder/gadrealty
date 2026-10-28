import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSettings } from '@/lib/data'
import { paragraphs } from '@/lib/format'
export const SITE_NAME = 'The Gad Gazette'
export const FIRM_NAME = 'Gad Realty NYC'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

const DEFAULT_PHONE = '+1 (212) 671-1897'
const DEFAULT_EMAIL = 'contactus@GadRealty.com'
const DEFAULT_ADDRESS = '589 Fifth Avenue, Suite 1007, New York, NY 10017'

// Official Department of State documents.
const DEFAULT_DISCLOSURE_URL =
  'https://dos.ny.gov/system/files/documents/2026/03/dos-2156-nys-housing-and-anti-discrimination-disclosure-form_11.2025.pdf'
const DEFAULT_FAIR_HOUSING_URL =
  'https://dos.ny.gov/system/files/documents/2025/03/nys-housing-and-anti-discrimination-notice_02.2025.pdf'

// From the current gadrealty.com. Edit in the back end under "Masthead and office details".
const DEFAULT_STORY = [
  'Beginning at age 16, our founder built a real estate career across two countries, with more than $500 million in residential and commercial sales. From first apartments to exceptional homes and investment properties, every client receives the same care, commitment, and attention.',
  'Our experience extends beyond buying and selling. We have managed renovations of retail and commercial spaces, apartments, and townhouses throughout New York City and New Jersey, guiding clients through design, construction, and the decisions along the way. We have helped buyers transform properties needing complete gut renovations into homes that, in some cases, nearly doubled in value.',
  'Whether you’re a seller, buyer, tenant, or landlord, we listen closely, advise honestly, and stay personally involved. Your trust matters to us, and we work to earn it through the care we give you and your property.',
]

export type Site = {
  mastheadLine: string
  establishedLine: string | null
  constructionLine: string
  jobTypes: string[]
  story: string[]
  ceoQuote: string | null
  phone: string
  phoneHref: string
  email: string
  address: string
  licenseLine: string | null
  disclosureUrl: string
  fairHousingUrl: string}

/** The words and facts used across the site: whatever the broker typed, otherwise a sensible default. */
export async function getSite(locale: Locale): Promise<Site> {
  const t = getDictionary(locale)
  let s: Awaited<ReturnType<typeof getSettings>> | null = null
  try {
    s = await getSettings(locale)
  } catch {
    s = null
  }

  const phone = s?.phone?.trim() || DEFAULT_PHONE
  const jobs = (s?.jobTypes ?? []).map((j) => j.job).filter(Boolean)

  return {
    mastheadLine: s?.mastheadLine?.trim() || t.mastheadLine,
    establishedLine: s?.establishedLine?.trim() || null,
    constructionLine: s?.constructionLine?.trim() || t.constructionDefault,
    jobTypes: jobs.length ? jobs : t.jobTypesDefault,
    story: paragraphs(s?.story).length ? paragraphs(s?.story) : DEFAULT_STORY,
    ceoQuote: s?.ceoQuote?.trim() || null,
    phone,
    phoneHref: `tel:${phone.replace(/[^+\d]/g, '')}`,
    email: s?.email?.trim() || DEFAULT_EMAIL,
    address: s?.address?.trim() || DEFAULT_ADDRESS,
    licenseLine: s?.licenseLine?.trim() || null,
    disclosureUrl: s?.disclosureUrl?.trim() || DEFAULT_DISCLOSURE_URL,
    fairHousingUrl: s?.fairHousingNoticeUrl?.trim() || DEFAULT_FAIR_HOUSING_URL,
  }
}
