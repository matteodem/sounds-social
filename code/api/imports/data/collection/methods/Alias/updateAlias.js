import { aliasCollection } from '../../AliasCollection'
import { fileCollection } from '../../FileCollection'
import { omitBy, isNil } from 'lodash/fp'
import { fetchOneAliasById } from './fetchOneAliasById'
import { canChangeMembers } from './updateAlias/canChangeMembers'

export const updateAlias = userId => _id => ({
  name,
  type,
  description,
  websiteUrl,
  avatarFile,
  invitedMemberIds,
  memberIds,
}) => {
  const aliasData = {
    name,
    type,
    description,
    websiteUrl,
    invitedMemberIds,
  }

  if (avatarFile) {
    aliasData.avatarFileId = fileCollection.insert({ ...avatarFile })
  }

  if (memberIds) {
    const alias = fetchOneAliasById(_id)

    if (canChangeMembers(alias)(memberIds)) aliasData.memberIds = memberIds
  }

  return aliasCollection.update(
    { _id, creatorId: userId },
    { $set: omitBy(isNil)(aliasData) }
  )
}
