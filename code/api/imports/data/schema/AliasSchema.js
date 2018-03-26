import SimpleSchema from 'simpl-schema'
import { createdAtAutoValue } from './autoValue/createdAtAutoValue'

export const aliasSchema = new SimpleSchema({
  name: {
    type: String,
    min: 3,
    max: 20,
  },
  // label, collective, duo etc.
  type: {
    type: String,
    min: 3,
    max: 20,
  },
  description: {
    type: String,
    optional: true,
    max: 280,
  },
  avatarFileId: {
    type: String,
    optional: true,
  },
  websiteUrl: {
    type: String,
    optional: true,
    max: 50,
  },
  createdAt: {
    type: Date,
    autoValue: createdAtAutoValue,
  },
  creatorId: {
    type: String,
  },
  memberIds: {
    type: Array,
    optional: true,
  },
  'memberIds.$': {
    type: String,
  },
  followerIds: {
    type: Array,
    optional: true,
  },
  'followerIds.$': {
    type: String,
  },
})
