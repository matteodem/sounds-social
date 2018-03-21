import SimpleSchema from 'simpl-schema'
import { createdAtAutoValue } from './autoValue/createdAtAutoValue'

export const newsletterSchema = new SimpleSchema({
  email: {
    type: String,
    unique: true,
    regEx: SimpleSchema.RegEx.Email,
  },
  createdAt: {
    type: Date,
    autoValue: createdAtAutoValue,
  },
})
