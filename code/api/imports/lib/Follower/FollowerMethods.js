import { uniq, get, getOr } from 'lodash/fp'
import { updateFollowerIds } from './updateFollowerIds'
import { fetchOneById } from '../../data/collection/methods/general/fetchOneById'

const findFollowerIds = collection => entityId => {
  return (fetchOneById(collection)(entityId) || {}).followerIds || []
}

export const findFollowerIdsForUser = collection => userId => {
  return collection
    .find(
      {
        followerIds: userId,
      },
      { fields: { _id: 1 } },
    )
    .map(get('_id'))
}

export const follow = collection => toFollowId => followerId => {
  const followerIds = findFollowerIds(collection)(toFollowId)

  updateFollowerIds(collection, toFollowId, uniq([...followerIds, followerId]))
}

export const unfollow = collection => toUnfollowId => followerId => {
  const followerIds = findFollowerIds(collection)(toUnfollowId)

  updateFollowerIds(
    collection,
    toUnfollowId,
    followerIds.filter(id => id !== followerId),
  )
}

export const isFollowedBy = collection => toFollowId => potentialFollowerId => {
  return findFollowerIds(collection)(toFollowId).includes(potentialFollowerId)
}

export const fetchFollowerCount = collection => referenceId => {
  return getOr(0)('followerIds.length')(fetchOneById(collection)(referenceId))
}
