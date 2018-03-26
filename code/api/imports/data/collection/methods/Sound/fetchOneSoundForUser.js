import { soundCollection } from '../../SoundCollection'
import { fetchAliasIdsForUser } from '../Alias/fetchAliasIdsForUser'

export const fetchOneSoundForUser = userId => _id => {
  const selector = { _id }
  selector.isPublic = true

  return soundCollection.findOne({
    $or: [
      selector,
      {
        _id,
        creatorId: {
          $in: [userId, ...fetchAliasIdsForUser(userId)],
        },
      },
    ],
  })
}
