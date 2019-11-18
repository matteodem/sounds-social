import { check } from 'meteor/check'
import { Random } from 'meteor/random'

export const startPlayingSoundResolver = soundsBeingPlayed => (
  root,
  args,
  context,
) => {
  const { userId } = context
  const { soundId } = args

  check(soundId, String)

  const soundPlayingId = Random.id()

  soundsBeingPlayed.push({
    soundPlayingId,
    soundId,
    userId,
    startedAt: new Date(),
  })

  return { soundPlayingId, soundId }
}
