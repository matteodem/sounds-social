import shuffleSeed from 'shuffle-seed'
import { RANDOM_MODE } from '../../constants/PlayerConstants'

export const getSoundsList = ({ sounds, randomSeed, mode }) => {
  if (mode === RANDOM_MODE) return shuffleSeed.shuffle(sounds, randomSeed)

  return sounds
}
