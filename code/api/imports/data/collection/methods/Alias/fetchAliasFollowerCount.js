import { fetchFollowerCount } from '../../../../lib/Follower/FollowerMethods'
import { aliasCollection } from '../../AliasCollection'

export const fetchAliasFollowerCount = fetchFollowerCount(aliasCollection)
