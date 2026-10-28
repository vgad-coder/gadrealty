import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

/**
 * Who can do what in the admin.
 *
 * - broker: Vanessa. Full control, approves what goes public, manages agents.
 * - agent:  adds and edits their own listings, tips and articles, but cannot publish.
 *
 * These helpers avoid depending on the generated payload-types file so the
 * config can be loaded before types exist.
 */

type MaybeUser = { id?: number | string; role?: string; agentProfile?: unknown } | null | undefined

export const isBroker = (user: MaybeUser): boolean => user?.role === 'broker'
export const isLoggedIn = (user: MaybeUser): boolean => Boolean(user)

/** Relationship values can be an id or a populated document. */
export const relationId = (value: unknown): number | string | undefined => {
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return undefined
}

export const brokerOnly: Access = ({ req }) => isBroker(req.user)
export const loggedIn: Access = ({ req }) => isLoggedIn(req.user)
export const anyone: Access = () => true

export const brokerOnlyField: FieldAccess = ({ req }) => isBroker(req.user)

/**
 * Content that goes through broker approval (listings, tips, films):
 * the public sees approved items only, agents also see their own drafts,
 * the broker sees everything.
 */
export const readApprovedOrOwn: Access = ({ req }) => {
  const user = req.user as MaybeUser
  if (isBroker(user)) return true
  if (user?.id !== undefined) {
    const ownOrPublished: Where = {
      or: [{ approved: { equals: true } }, { createdBy: { equals: user.id } }],
    }
    return ownOrPublished
  }
  const published: Where = { approved: { equals: true } }
  return published
}

/** Broker can change anything, an agent only the items they created. */
export const updateOwnOrBroker: Access = ({ req }) => {
  const user = req.user as MaybeUser
  if (isBroker(user)) return true
  if (user?.id !== undefined) return { createdBy: { equals: user.id } }
  return false
}

/** Stamp new items with the person who created them. */
export const stampCreatedBy = ({
  data,
  req,
  operation,
}: {
  data?: Record<string, unknown>
  req: PayloadRequest
  operation: string
}) => {
  if (!data) return data
  if (operation === 'create' && req.user && !data.createdBy) {
    data.createdBy = req.user.id
  }
  return data
}
