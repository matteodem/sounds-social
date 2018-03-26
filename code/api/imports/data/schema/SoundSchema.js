import SimpleSchema from 'simpl-schema'

export const soundSchema = new SimpleSchema({
  name: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  fileId: {
    type: String,
  },
  creatorId: {
    type: String,
  },
  ownerType: {
    type: String,
    optional: true,
    allowedValues: ['alias', 'user'], // if empty it's a user
  },
  coverFileId: {
    type: String,
    optional: true,
  },
  isPublic: {
    type: Boolean,
  },
  playsCount: {
    type: SimpleSchema.Integer,
    optional: true,
    autoValue() {
      if (this.isSet) {
        return this.value
      } else {
        return 0
      }
    },
  },
})
