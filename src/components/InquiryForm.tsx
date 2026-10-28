'use client'

import { useActionState } from 'react'

import { submitInquiry } from '@/app/(frontend)/actions'
import { initialFormState } from '@/lib/form-state'

export type FormLabels = {
  name: string
  email: string
  phone: string
  propertyAddress: string
  message: string
  send: string
  sending: string
  disclosure: string
}

/**
 * One form for valuation requests and questions about a home.
 * Add listingId to tie the message to a home, or askAddress to ask for the property address.
 */
export function InquiryForm({
  kind,
  labels,
  listingId,
  askAddress = false,
}: {
  kind: 'valuation' | 'listing' | 'general'
  labels: FormLabels
  listingId?: number
  askAddress?: boolean
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialFormState)

  if (state.status === 'success') {
    return (
      <p className="form__message" role="status">
        {state.message}
      </p>
    )
  }

  return (
    <form action={formAction} className="form" noValidate={false}>
      <input type="hidden" name="kind" value={kind} />
      {listingId ? <input type="hidden" name="listingId" value={listingId} /> : null}

      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form__two">
        <label className="field">
          <span className="label">{labels.name}</span>
          <input type="text" name="name" required maxLength={200} autoComplete="name" />
        </label>
        <label className="field">
          <span className="label">{labels.email}</span>
          <input type="email" name="email" required maxLength={320} autoComplete="email" />
        </label>
      </div>

      <div className="form__two">
        <label className="field">
          <span className="label">{labels.phone}</span>
          <input type="tel" name="phone" maxLength={60} autoComplete="tel" />
        </label>
        {askAddress ? (
          <label className="field">
            <span className="label">{labels.propertyAddress}</span>
            <input type="text" name="propertyAddress" maxLength={300} autoComplete="street-address" />
          </label>
        ) : (
          <span />
        )}
      </div>

      <label className="field">
        <span className="label">{labels.message}</span>
        <textarea name="message" rows={5} maxLength={5000} />
      </label>

      {state.status === 'error' ? (
        <p className="form__message form__message--error" role="alert">
          {state.message}
        </p>
      ) : null}

      <p className="form__note">{labels.disclosure}</p>

      <button type="submit" className="button" disabled={pending}>
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  )
}
