import { check } from 'meteor/check'
import { addToNewsletter } from '../../data/collection/methods/Newsletter/addToNewsletter'

const signupData = isSuccessful => ({ isSuccessful })

export default {
  typeDefs: [
    ` 
    type NewsletterSignup {
      isSuccessful: Boolean
    }
    
    input NewsletterInput {
      email: String!
    }
    
    extend type Mutation {
      addToNewsletter(data: NewsletterInput!): NewsletterSignup
    }
    `,
  ],
  resolvers: {
    Mutation: {
      addToNewsletter(root, args) {
        const { email } = args.data
        check(email, String)

        try {
          addToNewsletter(email)
        } catch (e) {
          return signupData(false)
        }

        return signupData(true)
      },
    },
  },
}
