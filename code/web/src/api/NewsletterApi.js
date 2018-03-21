import gql from 'graphql-tag'
import { apolloClient } from './graphql/client'

export const signUp = ({ email }) =>
  apolloClient.mutate({
    mutation: gql`
      mutation NewsletterSignUpMutation($email: String!) {
        addToNewsletter(data: { email: $email }) {
          isSuccessful
        }
      }
    `,
    variables: { email }
  })
