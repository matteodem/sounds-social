import { constant } from 'lodash/fp'
import { Index, MongoDBEngine } from 'meteor/easysearch:core'
import { userCollection } from '../collection/UserCollection'

// TODO: allow to search for profileName (profileCollection) too
export const userSearchIndex = new Index({
  collection: userCollection,
  fields: ['username'],
  permission: constant(true),
  engine: new MongoDBEngine(),
  defaultSearchOptions: { limit: 10 },
})
