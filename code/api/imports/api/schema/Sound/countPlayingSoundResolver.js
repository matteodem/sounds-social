import moment from 'moment'
import { check } from 'meteor/check'
import { countSoundPlay } from '../../../data/collection/methods/Sound/countSoundPlay'

export const countPlayingSoundResolver = soundsBeingPlayed => (
  root,
  args,
  context,
) => {
  const { userId } = context

  const { soundPlayingId, soundId } = args
  check(soundPlayingId, String)
  check(soundId, String)

  const shouldCountPlay = soundsBeingPlayed
    .filter(play => play.userId === userId)
    .every(play => {
      const sameIds =
        play.soundPlayingId === soundPlayingId && play.soundId === soundId
      const startedFiveSecondsAgo =
        moment.duration(moment(new Date()).diff(play.startedAt)).seconds() > 5

      return sameIds && startedFiveSecondsAgo
    })

  if (shouldCountPlay) countSoundPlay(soundId)

  soundsBeingPlayed = soundsBeingPlayed.filter(play => play.userId !== userId)

  return { soundPlayingId, soundId }
}
