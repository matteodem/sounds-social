import { Mongo } from 'meteor/mongo'
import { aliasSchema } from '../schema/AliasSchema'

export const aliasCollection = new Mongo.Collection('alias')

export const aliasCollectionName = aliasCollection.rawCollection()
  .collectionName

aliasCollection.attachSchema(aliasSchema)
