import { fetchAliasIdsForUser } from '../Alias/fetchAliasIdsForUser'

export const selectUserIsCreator = userId => {
  return {
    creatorId: {
      $in: [userId, ...fetchAliasIdsForUser(userId)],
    },
  }
}
