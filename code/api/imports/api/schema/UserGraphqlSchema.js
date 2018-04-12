import { defaultTo, flow, get } from 'lodash/fp'
import { withCache } from 'graphql-resolver-cache'
import { check } from 'meteor/check'
import { resolver, typeDef } from 'meteor/easy:graphqlizer'
import { userCollection } from '../../data/collection/UserCollection'
import { followUser } from '../../data/collection/methods/User/followUser'
import { fetchOneUserById } from '../../data/collection/methods/User/fetchOneUserById'
import { unfollowUser } from '../../data/collection/methods/User/unfollowUser'
import { isFollowedByUser } from '../../data/collection/methods/User/isFollowedByUser'
import { fetchAliasesForUser } from '../../data/collection/methods/Alias/fetchAliasesForUser'
import { fetchOneProfile } from '../../data/collection/methods/Profile/fetchOneProfile'
import { fetchUserFollowerCount } from '../../data/collection/methods/User/fetchUserFollowerCount'
import { fetchCreatorSoundPlayCount } from '../../data/collection/methods/Sound/fetchCreatorSoundPlayCount'
import { generateCacheKey } from '../helpers/generateCacheKey'
import { fetchDisplayName } from '../../data/collection/methods/Profile/fetchDisplayName'

const doUserMethod = userMethod => argIdKey => (root, args, context) => {
  const userId = args[argIdKey]
  check(userId, String)

  userMethod(userId)(context.userId)
  return fetchOneUserById(context.userId)
}

export default {
  resolvers: {
    Query: {
      getUser: resolver.get(userCollection),
      listUser: resolver.list(userCollection),
      currentUser: (root, args, context) =>
        flow(get('userId'), fetchOneUserById)(context),
    },
    Mutation: {
      followUser: doUserMethod(followUser)('toFollowId'),
      unfollowUser: doUserMethod(unfollowUser)('toUnfollowId'),
    },
    User: {
      canFollow: (root, args, context) =>
        context.userId && root._id !== context.userId,
      isFollowedByCurrentUser: (root, args, context) =>
        isFollowedByUser(root._id)(context.userId),
      profile: flow(get('_id'), fetchOneProfile, defaultTo({})),
      followerCount: withCache(flow(get('_id'), fetchUserFollowerCount), {
        key: generateCacheKey('followerCount'),
      }),
      displayName: flow(get('_id'), fetchDisplayName),
      playCount: withCache(flow(get('_id'), fetchCreatorSoundPlayCount), {
        key: ({ _id }) => `playCount${_id}`,
        maxAge: 1000 * 60,
      }),
      aliases: (root, args, context) =>
        fetchAliasesForUser(root._id)(context.grapherFields),
    },
  },
  typeDefs: [
    typeDef.get('User'),
    typeDef.list('User'),
    `
    type User {
      _id: String!
      username: String!
      displayName: String!
      canFollow: Boolean
      isFollowedByCurrentUser: Boolean
      profile: Profile!
      aliases: [Alias]
      followerCount: Int
      playCount: Int
    }
    
    input UserInput {
      username: String!
    }
    
    extend type Query {
      currentUser: User
    }
    extend type Mutation {
      followUser(toFollowId: String!): User
      unfollowUser(toUnfollowId: String!): User
    }
    `,
  ],
}
