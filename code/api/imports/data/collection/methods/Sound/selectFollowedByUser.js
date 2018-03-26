import { fetchUserFollowerIdsForUser } from '../User/fetchUserFollowerIdsForUser'
import { fetchAliasFollowerIdsForUser } from '../Alias/fetchAliasFollowerIdsForUser'
import { selectIsPublic } from '../general/selectIsPublic'

export const selectFollowedByUser = userId => {
  return {
    ...selectIsPublic(),
    creatorId: {
      $in: [
        ...fetchUserFollowerIdsForUser(userId),
        ...fetchAliasFollowerIdsForUser(userId),
      ],
    },
  }
}
