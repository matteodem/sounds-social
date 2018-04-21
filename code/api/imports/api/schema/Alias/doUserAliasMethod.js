import { checkRequiredString } from '../../../lib/check/check'
import { fetchOneAliasById } from '../../../data/collection/methods/Alias/fetchOneAliasById'

export const doUserAliasMethod = userMethod => argIdKey => (
  root,
  args,
  context
) => {
  if (!context.userId) return null

  const aliasId = args[argIdKey]
  checkRequiredString(aliasId)

  userMethod(aliasId)(context.userId)
  return fetchOneAliasById(aliasId)
}
