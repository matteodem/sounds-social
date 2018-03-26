import { constant, get } from 'lodash/fp'
import { Index, MongoDBEngine } from 'meteor/easysearch:core'
import { findRelatedFieldDocuments } from './findRelatedFieldDocuments'
import { soundCollection } from '../collection/SoundCollection'
import { aliasCollectionName } from '../collection/AliasCollection'
import { userCollectionName } from '../collection/UserCollection'
import { selectUserIsCreator } from '../collection/methods/Sound/selectUserIsCreator'
import { selectIsPublic } from '../collection/methods/general/selectIsPublic'

const searchByUsername = (config, query, cb) =>
  findRelatedFieldDocuments({
    collection: soundCollection,
    selector: config.selectorPerField('aggregatedAuthor.username', query),
    from: userCollectionName,
    localField: 'creatorId',
    foreignField: '_id',
    as: 'aggregatedAuthor',
  })

const searchByAliasName = (config, query, cb) =>
  findRelatedFieldDocuments({
    collection: soundCollection,
    selector: config.selectorPerField('aggregatedAliasAuthor.name', query),
    from: aliasCollectionName,
    localField: 'creatorId',
    foreignField: '_id',
    as: 'aggregatedAliasAuthor',
  })

export const soundSearchIndex = new Index({
  collection: soundCollection,
  fields: ['name', 'description'],
  permission: constant(true),
  engine: new MongoDBEngine({
    selector: function(...args) {
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
