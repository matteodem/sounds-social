import { Mongo } from 'meteor/mongo'
import { newsletterSchema } from '../schema/NewsletterSchema'

export const newsletterCollection = new Mongo.Collection('newsletter')

newsletterCollection.attachSchema(newsletterSchema)
