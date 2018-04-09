import SimpleSchema from 'simpl-schema'

export const profileSchema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
    min: 3,
    max: 40,
  },
  referenceId: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    optional: true,
    max: 200,
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
  profileName: {
    type: String,
    optional: true,
    min: 3,
    max: 40,
  },
  language: {
    type: String,
    optional: true,
  },
})
