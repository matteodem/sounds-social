import { get } from 'lodash/fp'
import { check, Match } from 'meteor/check'
import {
  makePaginatableResolver,
  resolveFindQuery,
} from '../../helpers/PaginationMethods'
import { SOUND_DEFAULT_LIMIT } from '../SoundGraphqlSchema'
import { findFeedSoundsForUser } from '../../../data/collection/methods/Sound/Feed/findFeedSoundsForUser'
import { findFeedSoundsForGroup } from '../../../data/collection/methods/Sound/Feed/findFeedSoundsForGroup'
import { findFeedSoundsForFeed } from '../../../data/collection/methods/Sound/Feed/findFeedSoundsForFeed'
import { findFeedSoundsForDiscover } from '../../../data/collection/methods/Sound/Feed/findFeedSoundsForDiscover'

export const listSoundResolver = makePaginatableResolver({
  defaultLimit: SOUND_DEFAULT_LIMIT,
  resolver: (root, args, context) => {
    const { filters } = args
    const { userId } = context

    check(filters, Match.Maybe(Array))

    const getValue = get('value')
    const compareKey = keyToCompare => ({ key }) => key === keyToCompare
    const userFilterId = getValue(filters.filter(compareKey('user'))[0])
    const groupFilterId = getValue(filters.filter(compareKey('group'))[0])
    const isFeed =
      getValue(filters.filter(compareKey('loggedInFeed'))[0]) === 'true'

    let findSoundsQuery

    if (userFilterId) {
      findSoundsQuery = findFeedSoundsForUser(userId)(userFilterId)
    }

    if (groupFilterId) {
      findSoundsQuery = findFeedSoundsForGroup(userId)(groupFilterId)
    }

    if (isFeed) findSoundsQuery = findFeedSoundsForFeed(userId)

    if (!findSoundsQuery) {
      findSoundsQuery = findFeedSoundsForDiscover(userId)
    }

    return resolveFindQuery(args)(findSoundsQuery)
  },
})
