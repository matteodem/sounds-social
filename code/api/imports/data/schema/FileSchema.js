import SimpleSchema from 'simpl-schema'

export const fileSchema = new SimpleSchema({
  hash: {
    type: String,
  },
  userId: {
    type: String,
  },
})
