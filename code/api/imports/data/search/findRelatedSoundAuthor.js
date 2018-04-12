import { findRelatedFieldDocuments } from './findRelatedFieldDocuments'
import { soundCollection } from '../collection/SoundCollection'

export const findRelatedSoundAuthor = ({
  selectorField,
  authorCollection,
  asName,
}) => {
  return (config, query) => {
    return findRelatedFieldDocuments({
      collection: soundCollection,
      selector: config.selectorPerField(selectorField, query),
      from: authorCollection,
      localField: 'creatorId',
      foreignField: '_id',
      as: asName,
    })
  }
}
