import { constant } from 'lodash/fp'
import { soundCollection } from '../../../SoundCollection'
import { flowMerge } from '../../../../../lib/flowMerge'
import { sortByNewest } from '../../general/sortByNewest'

export const findFeedSounds = selector => options => {
  return soundCollection.find(
    selector,
    flowMerge(sortByNewest, constant(options)),
  )
}
