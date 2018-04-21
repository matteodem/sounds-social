import { fetchOneAliasById } from './fetchOneAliasById'

export const currentUserIsInvitedToJoinAlias = userId => aliasId => {
  return (fetchOneAliasById(aliasId).invitedMemberIds || []).includes(userId)
}
