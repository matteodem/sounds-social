import { fetchOneMemberOfAlias } from './fetchOneMemberOfAlias'

// FIXME pretty sure there's a more elegant way
export const isMemberOfAlias = memberId => aliasId =>
  !!fetchOneMemberOfAlias(memberId)(aliasId)
