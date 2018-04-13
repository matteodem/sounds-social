import { profileCollection } from '../../ProfileCollection'

export const deleteProfile = referenceId => {
  profileCollection.remove({ referenceId })
}
