import { findFollowerIdsForUser } from '../../../../lib/Follower/FollowerMethods'
import { aliasCollection } from '../../AliasCollection'

export const fetchAliasFollowerIdsForUser = findFollowerIdsForUser(
  aliasCollection
)
