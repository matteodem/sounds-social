import { get } from 'lodash/fp'
import { soundCollection } from '../../SoundCollection'

export const fetchCreatorSoundPlayCount = creatorId => {
  return soundCollection
    .find(
      {
        creatorId,
      },
      { fields: { playsCount: 1 } },
    )
    .map(get('playsCount'))
    .reduce((a, b) => a + b, 0)
}
