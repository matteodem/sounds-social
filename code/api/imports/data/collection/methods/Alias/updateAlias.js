import { aliasCollection } from '../../AliasCollection'
import { fileCollection } from '../../FileCollection'
import { omitBy, isNil } from 'lodash/fp'

export const updateAlias = userId => _id => ({
  name,
  type,
  description,
  websiteUrl,
  avatarFile,
  invitedMemberIds,
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

  return aliasCollection.update(
    { _id, memberIds: userId },
    { $set: omitBy(isNil)(aliasData) }
  )
}
