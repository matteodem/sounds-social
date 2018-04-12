import moment from 'moment'

export const convertSoundPositionToPlayTime = soundPositionSeek =>
  moment({
    seconds: soundPositionSeek % 60,
    minutes: Math.floor(soundPositionSeek / 60),
    hours: Math.floor(soundPositionSeek / 60 / 60)
  }).format('HH:mm:ss')
