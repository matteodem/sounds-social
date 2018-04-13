import { flow } from 'lodash/fp'
import { fileCollection } from '../../FileCollection'
import { fetchCursor } from '../../../../lib/Cursor/fetchCursor'

export const fetchFilesForUser = flow(
  userId => ({ userId }),
  sel => fileCollection.find(sel),
  fetchCursor
)
