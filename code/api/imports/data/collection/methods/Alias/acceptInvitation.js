import { constant } from 'lodash/fp'
import { fetchOneAliasById } from './fetchOneAliasById'
import { aliasCollection } from '../../AliasCollection'
import { flowMerge } from '../../../../lib/flowMerge'

export const acceptInvitation = aliasId => invitedMemberId => accept => {
  const alias = fetchOneAliasById(aliasId)

  if (alias.invitedMemberIds.includes(invitedMemberId)) {
    const updateMethod = accept
      ? { $addToSet: { memberIds: invitedMemberId } }
      : {}

    aliasCollection.update(
      { _id: aliasId },
      flowMerge(
        constant({ $pull: { invitedMemberIds: invitedMemberId } }),
        constant(updateMethod)
      )
    )
  }
}
