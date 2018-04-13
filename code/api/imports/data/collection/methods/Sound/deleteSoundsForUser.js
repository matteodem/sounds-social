import { flow } from 'lodash/fp'
import { selectUserIsCreator } from './selectUserIsCreator'
import { soundCollection } from '../../SoundCollection'

export const deleteSoundsForUser = flow(selectUserIsCreator, sel =>
  soundCollection.remove(sel)
)
