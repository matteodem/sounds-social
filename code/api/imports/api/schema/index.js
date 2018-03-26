import { generateTypeDefsAndResolvers } from 'meteor/easy:graphqlizer'

import dateSchema from './DateGraphqlSchema'
import fileSchema from './FileGraphqlSchema'
import soundSchema from './SoundGraphqlSchema'
import userSchema from './UserGraphqlSchema'
import profileSchema from './ProfileGraphqlSchema'
import playlistSchema from './PlaylistGraphqlSchema'
import aliasSchema from './AliasGraphqlSchema'
import creatorSchema from './CreatorGraphqlSchema'
import paginationSchema from './PaginationGraphqlSchema'
import newsletterSchema from './NewsletterGraphqlSchema'

const { typeDefs, resolvers } = generateTypeDefsAndResolvers({
  schemas: [
    dateSchema,
    fileSchema,
    soundSchema,
    userSchema,
    profileSchema,
    playlistSchema,
    aliasSchema,
    creatorSchema,
    paginationSchema,
    newsletterSchema,
  ],
})

export { typeDefs, resolvers }
