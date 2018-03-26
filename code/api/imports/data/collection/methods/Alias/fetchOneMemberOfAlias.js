import { aliasCollection } from '../../AliasCollection'

export const fetchOneMemberOfAlias = memberId => aliasId =>
  aliasCollection.findOne({ _id: aliasId, memberIds: memberId })
