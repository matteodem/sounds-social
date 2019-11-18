import { playlistCollection } from '../../PlaylistCollection'

export const updatePlaylist = ({
  playlistId,
  name,
  userId,
  isPublic,
  description,
  soundIds,
}) => {
  const fieldsToUpdate = { $set: {} }

  fieldsToUpdate.$set.name = name
  fieldsToUpdate.$set.description = description
  fieldsToUpdate.$set.isPublic = isPublic
  fieldsToUpdate.$set.soundIds = soundIds

  playlistCollection.update(
    { _id: playlistId, creatorId: userId },
    fieldsToUpdate,
  )
}
