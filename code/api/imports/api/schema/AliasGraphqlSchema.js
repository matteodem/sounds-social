import { flow, get, map } from 'lodash/fp'
import { check } from 'meteor/check'
import { withCache } from 'graphql-resolver-cache-key-config' // FIXME use original pkg once in there
import { fetchOneFileById } from '../../data/collection/methods/File/fetchOneFileById'
import { fetchOneUserById } from '../../data/collection/methods/User/fetchOneUserById'
import { followAlias } from '../../data/collection/methods/Alias/followAlias'
import { unfollowAlias } from '../../data/collection/methods/Alias/unfollowAlias'
import { isFollowedByAlias } from '../../data/collection/methods/Alias/isFollowedByAlias'
import { fetchOneAliasById } from '../../data/collection/methods/Alias/fetchOneAliasById'
import { deleteAlias } from '../../data/collection/methods/Alias/deleteAlias'
import { updateAlias } from '../../data/collection/methods/Alias/updateAlias'
import { createAlias } from '../../data/collection/methods/Alias/createAlias'
import { fetchAliasesForUser } from '../../data/collection/methods/Alias/fetchAliasesForUser'
import { fetchAliasFollowerCount } from '../../data/collection/methods/Alias/fetchAliasFollowerCount'
import { generateCacheKey } from '../helpers/generateCacheKey'
import { fetchCreatorSoundPlayCount } from '../../data/collection/methods/Sound/fetchCreatorSoundPlayCount'
import { AliasTypeDef } from './Alias/AliasTypeDef'
import { isCreatorResolver } from './general/isCreatorResolver'

export default {
  typeDefs: [AliasTypeDef],
  resolvers: {
    Alias: {
      avatarFile: flow(get('avatarFileId'), fetchOneFileById),
      members: flow(get('memberIds'), map(fetchOneUserById)),
      canFollow: (root, args, context) =>
        context.userId && !root.memberIds.includes(context.userId),
      isEditable: isCreatorResolver,
      isFollowedByCurrentUser: (root, args, context) => {
        return isFollowedByAlias(root._id)(context.userId)
      },
      followerCount: withCache(flow(get('_id'), fetchAliasFollowerCount), {
        key: generateCacheKey('followerCount'),
      }),
      playCount: withCache(flow(get('_id'), fetchCreatorSoundPlayCount), {
        key: generateCacheKey('playCount'),
      }),
    },
    Query: {
      listAliasForUser(root, args, context) {
        const userId = args.userId || context.userId
        return fetchAliasesForUser(userId)(context.grapherFields)
      },
      getAlias(root, args, context) {
        check(args._id, String)
        return fetchOneAliasById(args._id)
      },
    },
    Mutation: {
      createAlias(root, args, context) {
        if (!context.userId) return null

        const id = createAlias(context.userId)(args.data)

        return fetchOneAliasById(id)
      },
      updateAlias(root, args, context) {
        if (!context.userId) return null
        check(args._id, String)

        updateAlias(context.userId)(args._id)(args.data)

        return fetchOneAliasById(args._id)
      },
      removeAlias(root, args, context) {
        if (!context.userId) return null
        check(args._id, String)

        const alias = fetchOneAliasById(args._id)

        deleteAlias(context.userId)(args._id)

        return alias
      },
      followAlias(root, args, context) {
        if (!context.userId) return null

        const { toFollowId } = args
        check(toFollowId, String)

        followAlias(toFollowId)(context.userId)
        return fetchOneAliasById(toFollowId)
      },
      unfollowAlias(root, args, context) {
        if (!context.userId) return null

        const { toUnfollowId } = args
        check(toUnfollowId, String)

        unfollowAlias(toUnfollowId)(context.userId)
        return fetchOneAliasById(toUnfollowId)
      },
    },
  },
}
