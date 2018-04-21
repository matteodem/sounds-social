import { constant, get } from 'lodash/fp'
import { Index, MongoDBEngine } from 'meteor/easysearch:core'
import { soundCollection } from '../collection/SoundCollection'
import { aliasCollectionName } from '../collection/AliasCollection'
import { userCollectionName } from '../collection/UserCollection'
import { selectUserIsCreator } from '../collection/methods/Sound/selectUserIsCreator'
import { selectIsPublic } from '../collection/methods/general/selectIsPublic'
import { findRelatedSoundAuthor } from './findRelatedSoundAuthor'

const searchByUsername = findRelatedSoundAuthor({
  selectorField: 'aggregatedAuthor.username',
  authorCollection: userCollectionName,
  asName: 'aggregatedAuthor',
})

const searchByAliasName = findRelatedSoundAuthor({
  selectorField: 'aggregatedAliasAuthor.name',
  authorCollection: aliasCollectionName,
  asName: 'aggregatedAliasAuthor',
})

export const soundSearchIndex = new Index({
  collection: soundCollection,
  fields: ['name', 'description'],
  permission: constant(true),
  engine: new MongoDBEngine({
    selector(...args) {
      const defaultConfig = this.defaultConfiguration()
      const selector = defaultConfig.selector(...args)

      const [queryObject, { search: { userId } }] = args

      return {
        $and: [
          { $or: [selectUserIsCreator(userId), selectIsPublic()] },
          {
            $or: [
              ...selector.$or,
              {
                _id: {
                  $in: [
                    ...searchByUsername(defaultConfig, queryObject.name).map(
                      get('_id')
                    ),
                    ...searchByAliasName(defaultConfig, queryObject.name).map(
                      get('_id')
                    ),
                  ],
                },
              },
            ],
          },
        ],
      }
    },
  }),
})
