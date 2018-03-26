import { isMemberOfAlias } from '../Alias/isMemberOfAlias'
import { fetchOneSoundById } from './fetchOneSoundById'

export const isPermittedToChangeSound = userId => _id => {
  const doc = fetchOneSoundById(_id)

  if (doc.ownerType === 'alias') {
    return isMemberOfAlias(userId)(doc.creatorId)
  }

  return doc.creatorId === userId
}
