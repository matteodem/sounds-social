import { map } from 'lodash/fp'
import { soundCollection } from '../../SoundCollection'
import { fetchOnePlaylistForUser } from '../Playlist/fetchOnePlaylistForUser'
import { selectIsPublic } from '../general/selectIsPublic'
import { selectUserIsCreator } from './selectUserIsCreator'

const mapToSoundIdSelector = userId =>
  map(soundId => {
    return {
      _id: soundId,
      $or: [selectIsPublic(), selectUserIsCreator(userId)],
    }
  })

export const findSoundsForPlaylist = userId => playlistId => options => {
  const playlist = fetchOnePlaylistForUser(userId)(playlistId)

  if (playlist) {
    const { soundIds } = playlist

    return soundCollection.find(
      { $or: mapToSoundIdSelector(userId)(soundIds) },
      options,
    )
  }
}
