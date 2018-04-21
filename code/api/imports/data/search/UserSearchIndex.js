import { constant, map, get } from 'lodash/fp'
import { Index, MongoDBEngine } from 'meteor/easysearch:core'
import { userCollection } from '../collection/UserCollection'
import { profileCollection } from '../collection/ProfileCollection'

export const userSearchIndex = new Index({
  collection: userCollection,
  fields: ['username'],
  permission: constant(true),
  engine: new MongoDBEngine({
    selector(...args) {
      const defaultConfig = this.defaultConfiguration()
      const selector = defaultConfig.selector(...args)

      const [queryObject] = args

      const query = Object.values(queryObject)[0]
      const mapToUserIds = map(get('referenceId'))

      const profiles = profileCollection
        .find(defaultConfig.selectorPerField('profileName', query), {
          limit: 10,
          fields: { referenceId: 1 },
        })
        .fetch()

      selector.$or.push({
        _id: { $in: mapToUserIds(profiles) },
      })

      return selector
    },
  }),
  defaultSearchOptions: { limit: 10 },
})
