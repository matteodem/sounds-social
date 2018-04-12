import { isNumber } from 'lodash/fp'
import { Howl } from 'howler'

let soundPlayer
let currentHandle
let isMuted
let hasPaused
let currentSoundData = {}

export const playSound = url => {
  if (soundPlayer && !currentSoundData.duration) {
    return null
  }
  if (soundPlayer) {
    soundPlayer.stop()
    soundPlayer.unload()
  }
  if (currentHandle) clearInterval(currentHandle)

  soundPlayer = new Howl({
    src: [url],
    preload: true,
    html5: true
  })

  setTimeout(() => {
    if (!hasPaused) soundPlayer.play()

    currentHandle = setInterval(() => {
      currentSoundData.duration = soundPlayer.duration()
      currentSoundData.seek = soundPlayer.seek()
      currentSoundData.isPlaying = soundPlayer.playing()
    }, 50)
  }, 1000)

  currentSoundData = {}
  hasPaused = false

  if (isMuted) muteSound()
}

const updateSoundData = update => () => {
  const { seek, duration, isPlaying } = currentSoundData

  if (hasPaused) return null

  if (seek === 0 && !isPlaying) {
    update('done')
    currentSoundData.seek = null
  } else if (isNumber(seek)) {
    update('soundPosition', { duration, seek })
  }
}

export const onPlayerEvent = emit => {
  setInterval(updateSoundData(emit), 50)
}

export const continueCurrentSound = () => {
  soundPlayer.play()
  hasPaused = false
}

export const pauseCurrentSound = () => {
  soundPlayer.pause()
  hasPaused = true
}

export const muteSound = () => {
  soundPlayer.mute(true)
  isMuted = true
}

export const unmuteSound = () => {
  soundPlayer.mute(false)
  isMuted = false
}

export const seekCurrentSound = seekInSeconds => {
  soundPlayer.seek(seekInSeconds)
}
