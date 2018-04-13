import { flow } from 'lodash/fp'
import { soundCollection } from '../../SoundCollection'
import { selectUserIsCreator } from './selectUserIsCreator'
import { fetchCursor } from '../../../../lib/Cursor/fetchCursor'

export const fetchSoundsForCreator = flow(
  selectUserIsCreator,
  sel => soundCollection.find(sel),
  fetchCursor
)
