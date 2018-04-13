import { playlistCollection } from '../../PlaylistCollection'

export const deletePlaylistsForUser = creatorId => {
  playlistCollection.remove({ creatorId })
}
