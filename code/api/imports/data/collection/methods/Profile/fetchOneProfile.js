import { profileCollection } from '../../ProfileCollection'

export const fetchOneProfile = referenceId =>
  profileCollection.findOne({ referenceId })
