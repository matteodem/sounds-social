import { findFollowerIdsForUser } from '../../../../lib/Follower/FollowerMethods'
import { userCollection } from '../../UserCollection'

export const fetchUserFollowerIdsForUser = findFollowerIdsForUser(
  userCollection,
)
