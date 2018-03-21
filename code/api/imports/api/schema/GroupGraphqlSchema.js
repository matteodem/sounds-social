import { flow, get, map } from 'lodash/fp'
import { check } from 'meteor/check'
import { withCache } from 'graphql-resolver-cache-key-config' // FIXME use original pkg once in there
import { fetchOneFileById } from '../../data/collection/methods/File/fetchOneFileById'
import { fetchOneUserById } from '../../data/collection/methods/User/fetchOneUserById'
import { followGroup } from '../../data/collection/methods/Group/followGroup'
import { unfollowGroup } from '../../data/collection/methods/Group/unfollowGroup'
import { isFollowedByGroup } from '../../data/collection/methods/Group/isFollowedByGroup'
import { fetchOneGroupById } from '../../data/collection/methods/Group/fetchOneGroupById'
import { deleteGroup } from '../../data/collection/methods/Group/deleteGroup'
import { updateGroup } from '../../data/collection/methods/Group/updateGroup'
import { createGroup } from '../../data/collection/methods/Group/createGroup'
import { fetchGroupsForUser } from '../../data/collection/methods/Group/fetchGroupsForUser'
import { fetchGroupFollowerCount } from '../../data/collection/methods/Group/fetchGroupFollowerCount'
import { generateCacheKey } from '../helpers/generateCacheKey'
import { fetchCreatorSoundPlayCount } from '../../data/collection/methods/Sound/fetchCreatorSoundPlayCount'
import { GroupTypeDef } from './Group/GroupTypeDef'
import { isCreatorResolver } from './general/isCreatorResolver'

export default {
  typeDefs: [GroupTypeDef],
  resolvers: {
    Group: {
      avatarFile: flow(get('avatarFileId'), fetchOneFileById),
      members: flow(get('memberIds'), map(fetchOneUserById)),
      canFollow: (root, args, context) =>
        context.userId && !root.memberIds.includes(context.userId),
      isEditable: isCreatorResolver,
      isFollowedByCurrentUser: (root, args, context) => {
        return isFollowedByGroup(root._id)(context.userId)
      },
      followerCount: withCache(flow(get('_id'), fetchGroupFollowerCount), {
        key: generateCacheKey('followerCount'),
      }),
      playCount: withCache(flow(get('_id'), fetchCreatorSoundPlayCount), {
        key: generateCacheKey('playCount'),
      }),
    },
    Query: {
      listGroupForUser(root, args, context) {
        const userId = args.userId || context.userId
        return fetchGroupsForUser(userId)(context.grapherFields)
      },
      getGroup(root, args, context) {
        check(args._id, String)
        return fetchOneGroupById(args._id)
      },
    },
    Mutation: {
      createGroup(root, args, context) {
        if (!context.userId) return null

        const id = createGroup(context.userId, args.data)

        return fetchOneGroupById(id)
      },
      updateGroup(root, args, context) {
        if (!context.userId) return null
        check(args._id, String)

        updateGroup(context.userId)(args._id)(args.data)

        return fetchOneGroupById(args._id)
      },
      removeGroup(root, args, context) {
        if (!context.userId) return null
        check(args._id, String)

        const group = fetchOneGroupById(args._id)

        deleteGroup(context.userId)(args._id)

        return group
      },
      followGroup(root, args, context) {
        if (!context.userId) return null

        const { toFollowId } = args
        check(toFollowId, String)

        followGroup(toFollowId)(context.userId)
        return fetchOneGroupById(toFollowId)
      },
      unfollowGroup(root, args, context) {
        if (!context.userId) return null

        const { toUnfollowId } = args
        check(toUnfollowId, String)

        unfollowGroup(toUnfollowId)(context.userId)
        return fetchOneGroupById(toUnfollowId)
      },
    },
  },
}
