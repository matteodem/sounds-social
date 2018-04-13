import { playlistCollection } from '../../PlaylistCollection'

export const fetchPlaylistsForUser = currentUserId => userId => {
  const selector = { creatorId: userId }

  if (userId !== currentUserId) selector.isPublic = true

  return playlistCollection.find(selector, { sort: { createdAt: -1 } }).fetch()
}
