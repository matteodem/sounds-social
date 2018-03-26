import { aliasCollection } from '../../AliasCollection'

export const fetchAliasesForUser = userId => fields =>
  aliasCollection
    .find(
      {
        memberIds: userId,
      },
      { fields }
    )
    .fetch()
