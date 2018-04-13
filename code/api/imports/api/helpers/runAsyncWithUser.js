import { Async } from 'meteor/meteorhacks:async'
import { getRequiredUserFromToken } from '../../lib/User/getRequiredUserFromToken'

export const runAsyncWithUser = ({ userToken, onUser }) => {
  return Async.runSync(done => {
    getRequiredUserFromToken(userToken)
      .then(user => {
        if (!user) {
          return done('No user found')
        }

        onUser({ user, done })
      })
      .catch(e => {
        console.error(e)
        done('No user found')
      })
  })
}
