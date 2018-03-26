import { isMemberOfAlias } from '../../Alias/isMemberOfAlias'
import { findFeedSounds } from './findFeedSounds'

export const findFeedSoundsForAlias = currentUserId => aliasId => {
  const selector = {
    creatorId: aliasId,
    ownerType: 'alias',
  }

  if (!isMemberOfAlias(currentUserId)(aliasId)) {
    selector.isPublic = true
  }

  return findFeedSounds(selector)
}
