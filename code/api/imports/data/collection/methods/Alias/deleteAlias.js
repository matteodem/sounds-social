import { aliasCollection } from '../../AliasCollection'

export const deleteAlias = creatorId => _id =>
  aliasCollection.remove({ _id, creatorId })
