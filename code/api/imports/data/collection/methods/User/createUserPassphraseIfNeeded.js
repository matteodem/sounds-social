import { generatePassphrase } from 'niceware'
import { userCollection } from '../../UserCollection'
import { fetchOneUserById } from './fetchOneUserById'

export const createUserPassphraseIfNeeded = userId => {
  const user = fetchOneUserById(userId)

  if (!user.passphrase) {
    userCollection.update(
      { _id: userId },
      { $set: { passphrase: generatePassphrase(16).join(' ') } }
    )
  }
}
