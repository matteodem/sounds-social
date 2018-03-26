import { aliasCollection } from '../../AliasCollection'
import { fileCollection } from '../../FileCollection'

export const createAlias = userId => ({
  name,
  type,
  description,
  websiteUrl,
  avatarFile,
}) => {
  const aliasData = {
    creatorId: userId,
    memberIds: [userId],
    name,
    type,
    description,
    websiteUrl,
  }

  if (avatarFile) {
    aliasData.avatarFileId = fileCollection.insert({ ...avatarFile })
  }

  return aliasCollection.insert(aliasData)
}
