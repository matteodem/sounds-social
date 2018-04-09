import { aliasCollection } from '../../AliasCollection'

export const fetchOneMemberOfAlias = memberId => aliasId => {
  if (!memberId || !aliasId) return null
  return aliasCollection.findOne({ _id: aliasId, memberIds: memberId })
}
