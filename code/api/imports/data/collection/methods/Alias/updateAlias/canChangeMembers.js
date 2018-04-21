import { difference, isEmpty } from 'lodash/fp'

export const canChangeMembers = alias => newMemberIds => {
  if (!newMemberIds.includes(alias.creatorId)) return false

  const memberDifference = difference(alias.memberIds)(newMemberIds)
  const isReorderingMembers = isEmpty(memberDifference)
  const isRemovingMembers = newMemberIds.length < alias.memberIds.length

  return isReorderingMembers || isRemovingMembers
}
