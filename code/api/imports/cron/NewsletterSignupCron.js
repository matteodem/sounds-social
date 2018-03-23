import { newsletterCollection } from '../data/collection/NewsletterCollection'
import moment from 'moment'

const notifySignUps = () => {
  const allSignUpCount = newsletterCollection.find().count()
  const lastDaySignUpCount = newsletterCollection
    .find({
      createdAt: {
        $gte: moment()
          .subtract(1, 'd')
          .toDate(),
      },
    })
    .count()

  console.log(
    `Newsletter SignUps: ${lastDaySignUpCount} since 24 hours (${allSignUpCount} in total)`
  )

  setTimeout(notifySignUps, 1000 * 60 * 60 * 24)
}

notifySignUps()
