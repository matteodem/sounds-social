import { aliasCollection } from '../../AliasCollection'
import { fileCollection } from '../../FileCollection'
import { omitBy, isNil, difference, isEmpty } from 'lodash/fp'
import { fetchOneAliasById } from './fetchOneAliasById'

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

    if (isEmpty(difference(alias.memberIds)(memberIds))) {
      aliasData.memberIds = memberIds
    }
  }

  return aliasCollection.update(
    { _id, creatorId: userId },
    { $set: omitBy(isNil)(aliasData) }
  )
}
