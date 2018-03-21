import { newsletterCollection } from '../../NewsletterCollection'

export const addToNewsletter = email => {
  newsletterCollection.insert({ email })
}
