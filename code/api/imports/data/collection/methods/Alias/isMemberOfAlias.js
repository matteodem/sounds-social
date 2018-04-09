import { fetchOneMemberOfAlias } from './fetchOneMemberOfAlias'

export const isMemberOfAlias = memberId => aliasId =>
  !!fetchOneMemberOfAlias(memberId)(aliasId)
