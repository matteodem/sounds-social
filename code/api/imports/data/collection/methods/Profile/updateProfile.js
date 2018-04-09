import { omit } from 'lodash/fp'
import { profileCollection } from '../../ProfileCollection'
import { fileCollection } from '../../FileCollection'

export const updateProfile = referenceId => profileData => {
  const selector = { referenceId }
  const existingProfile = profileCollection.findOne(selector)

  const { avatarFile } = profileData

  const omitAvatarFile = omit(['avatarFile'])

  if (avatarFile) {
    profileData.avatarFileId = fileCollection.insert({ ...avatarFile })
  }

  if (!existingProfile) {
    return profileCollection.insert({
      ...omitAvatarFile(profileData),
      referenceId,
      type: 'user',
    })
  }

  return profileCollection.update(selector, {
    $set: omitAvatarFile(profileData),
  })
}
