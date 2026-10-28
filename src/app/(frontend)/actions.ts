'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { ENABLED_LOCALES, LOCALE_COOKIE, isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getPayloadClient } from '@/lib/data'
import type { FormState } from '@/lib/form-state'
import { getLocale } from '@/lib/locale'
import { getSite } from '@/lib/site'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const KINDS = ['valuation', 'listing', 'general'] as const
type Kind = (typeof KINDS)[number]

function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, max)
}

/**
 * Receives the valuation and inquiry forms. The message is saved in the back
 * office and emailed to the office (and the agent for that home). The sender
 * also gets the link to the New York State disclosure form.
 */
export async function submitInquiry(_previous: FormState, formData: FormData): Promise<FormState> {
  const locale = await getLocale()
  const t = getDictionary(locale)

  // A hidden field that people never see. Bots fill it in, so we quietly ignore them.
  if (clean(formData.get('website'), 200) !== '') return { status: 'success', message: t.form.thanks }

  const name = clean(formData.get('name'), 200)
  const email = clean(formData.get('email'), 320)
  const phone = clean(formData.get('phone'), 60)
  const message = clean(formData.get('message'), 5000)
  const propertyAddress = clean(formData.get('propertyAddress'), 300)
  const rawKind = clean(formData.get('kind'), 20)
  const kind: Kind = (KINDS as readonly string[]).includes(rawKind) ? (rawKind as Kind) : 'general'
  const listingId = Number(clean(formData.get('listingId'), 20)) || undefined

  if (!name || !EMAIL_PATTERN.test(email)) return { status: 'error', message: t.form.required }

  try {
    const payload = await getPayloadClient()
    const site = await getSite(locale)

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: { kind, name, email, phone, message, propertyAddress, listing: listingId, language: locale },
    })

    // Emails are best effort: the inquiry is already safely saved above.
    try {
      let agentEmail: string | undefined
      let listingLabel = ''
      if (listingId) {
        const listing = await payload.findByID({ collection: 'listings', id: listingId, depth: 1 })
        listingLabel = [listing.address, listing.unit].filter(Boolean).join(', ')
        if (listing.agent && typeof listing.agent === 'object') agentEmail = listing.agent.email ?? undefined
      }

      const office = process.env.OFFICE_EMAIL || site.email
      const subjectKind =
        kind === 'valuation' ? 'Valuation request' : kind === 'listing' ? 'Question about a home' : 'Message'
      const lines = [
        `${subjectKind} from the website`,
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Telephone: ${phone}` : null,
        propertyAddress ? `Address of the property: ${propertyAddress}` : null,
        listingLabel ? `About the home: ${listingLabel}` : null,
        `Language: ${locale}`,
        '',
        message || '(no message)',
      ].filter((line): line is string => line !== null)

      await payload.sendEmail({
        to: [office, agentEmail].filter((v): v is string => Boolean(v)),
        subject: `${subjectKind}: ${name}${listingLabel ? ` · ${listingLabel}` : ''}`,
        text: lines.join('\n'),
        replyTo: email,
      })

      await payload.sendEmail({
        to: email,
        subject: 'Thank you from Gad Realty NYC',
        text: [
          `Dear ${name},`,
          '',
          'Thank you for writing to Gad Realty NYC. We have your message and will reply personally.',
          '',
          'Federal, State and local fair housing laws protect you from discrimination in housing. This link contains information regarding the New York State Human Rights Law, in the form of the New York State Housing and Anti-Discrimination Disclosure Form:',
          site.disclosureUrl,
          '',
          `Gad Realty NYC · ${site.address} · ${site.phone}`,
        ].join('\n'),
      })

      await payload.update({
        collection: 'inquiries',
        id: inquiry.id,
        data: { disclosureSentAt: new Date().toISOString() },
      })
    } catch (error) {
      console.error('[inquiry] The message was saved but the email could not be sent:', error)
    }

    return { status: 'success', message: t.form.thanks }
  } catch (error) {
    console.error('[inquiry] Could not save the message:', error)
    return { status: 'error', message: t.form.error }
  }
}

/** The language buttons in the footer. Only languages switched on in i18n/config.ts are accepted. */
export async function setLocaleAction(formData: FormData): Promise<void> {
  const value = String(formData.get('locale') ?? '')
  if (!isLocale(value) || !ENABLED_LOCALES.includes(value)) return
  const store = await cookies()
  store.set(LOCALE_COOKIE, value, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  revalidatePath('/', 'layout')
}
