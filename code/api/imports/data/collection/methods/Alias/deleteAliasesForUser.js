import { aliasCollection } from '../../AliasCollection'

export const deleteAliasesForUser = userId => {
  aliasCollection.remove({
    creatorId: userId,
    memberIds: {
      $all: [userId],
    },
  })
}
