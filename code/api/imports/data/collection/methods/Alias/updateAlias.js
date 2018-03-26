import { aliasCollection } from '../../AliasCollection'
import { fileCollection } from '../../FileCollection'
import { omitBy, isNil } from 'lodash/fp'

export const updateAlias = userId => _id => ({
  name,
  type,
  description,
  websiteUrl,
  avatarFile,
}) => {
  const aliasData = {
    name,
    type,
    description,
    websiteUrl,
  }

  if (avatarFile) {
    aliasData.avatarFileId = fileCollection.insert({ ...avatarFile })
  }

  return aliasCollection.update(
    { _id, memberIds: userId },
    { $set: omitBy(isNil)(aliasData) }
  )
}
