import { defaultTo } from 'lodash/fp'

export const getDecimalSoundProgress = ({ seek, duration }) => {
  if (seek === 0) return 0

  return seek / defaultTo(1)(duration)
}
