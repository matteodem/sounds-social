import { findSoundKeyById } from '../StoreSoundPlayerModule'

export const playerPlayRelativeByKeyIndex = relativeKeyIndex => ({
  state,
  getters,
  dispatch
}) => {
  const { soundPlayerSounds: sounds } = getters
  const key = parseInt(findSoundKeyById(state.currentId)(sounds), 10)

  const keyToPlay = key + relativeKeyIndex

  if (sounds[keyToPlay]) {
    dispatch('changeSoundToPlay', { soundId: sounds[keyToPlay].id })
  } else dispatch('pause')
}
