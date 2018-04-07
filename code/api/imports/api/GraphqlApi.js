import cors from 'cors'
import { defaultTo } from 'lodash/fp'
import { makeExecutableSchema } from 'graphql-tools'
import { getSchema, loadSchema } from 'graphql-loader'
import { createApolloServer } from 'meteor/apollo'
import { LruCache } from 'graphql-resolver-cache'
import { initAccounts } from 'meteor/nicolaslopezj:apollo-accounts'
import { checkUserIdMaybe } from '../lib/check/checkUserData'
import mongoFieldsMiddleware from '../middleware/MongoFieldsContextMiddleware'

import { resolvers, typeDefs } from './schema'

initAccounts()

loadSchema({ typeDefs, resolvers })

const schema = makeExecutableSchema(getSchema())

mongoFieldsMiddleware(schema)

const lruCache = new LruCache(300)

createApolloServer(
  req => {
    return {
      graphiql: true,
      pretty: true,
      schema,
      context: userContext => {
        checkUserIdMaybe(userContext.userId)

        return {
          ...userContext,
          resolverCache: lruCache,
          userLanguage: defaultTo('en')(req.header('accept-language')),
        }
      },
    }
  },
  {
    configServer: graphQLServer => {
      graphQLServer.use(cors())
    },
  }
)
