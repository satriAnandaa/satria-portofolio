import type { Access, AccessArgs, Where } from 'payload'

export const adminOnly: Access = ({ req }) => Boolean(req.user)
const publicContent: Where = {
  and: [{ _status: { equals: 'published' } }, { archived: { not_equals: true } }],
}
export const publishedOnly: Access = ({ req }) => req.user ? true : publicContent
export const readGlobal = ({ req }: AccessArgs): boolean => {
  if (req.user) return true
  return ![true, 'true'].includes(req.query?.draft as boolean | string)
}
export const readMedia: Access = ({ req }) => req.user ? true : { visibility: { equals: 'public' } }
