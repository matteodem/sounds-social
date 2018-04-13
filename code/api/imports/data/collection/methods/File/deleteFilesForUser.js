import { fileCollection } from '../../FileCollection'

export const deleteFilesForUser = userId => {
  fileCollection.remove({ userId })
}
