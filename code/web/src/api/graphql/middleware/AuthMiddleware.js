import { ApolloLink } from 'apollo-client-preset'
import { getUserToken } from '../../../config/getUserToken'

export const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'meteor-login-token': getUserToken()
    }
  }))

  return forward(operation)
})
