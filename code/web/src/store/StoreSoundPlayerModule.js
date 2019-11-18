import { clone, filter, find, findKey, flow, get } from 'lodash/fp'
import * as player from '../func/SoundPlayer'
import { countPlayingSound, startPlayingSound } from '../api/SoundApi'
import { isValidMode, RANDOM_MODE } from '../constants/PlayerConstants'
import { playerPlayRelativeByKeyIndex } from './StoreSoundPlayerModule/playRelativeByKeyIndex'
import { convertSoundPositionToPlayTime } from './StoreSoundPlayerModule/convertSoundPositionToPlayTime'
import { getDecimalSoundProgress } from './StoreSoundPlayerModule/getDecimalSoundProgress'
import { getSoundsList } from './StoreSoundPlayerModule/getSoundsList'
import { addSoundToPlayerAction } from './StoreSoundPlayerModule/addSoundToPlayerAction'
import { moveSoundAction } from './StoreSoundPlayerModule/moveSoundAction'
import { changeSoundAfterFinishedAction } from './StoreSoundPlayerModule/changeSoundAfterFinishedAction'
import { isFirstSound } from './StoreSoundPlayerModule/isAtNthSound'

export const findSoundKeyById = soundId =>
  findKey(sound => sound.id === soundId)
export const findSoundById = soundId => find(sound => sound.id === soundId)
export const hasSounds = state => state.sounds.length > 0

const filterOutSoundById = soundIdToFilter =>
  filter(sound => sound.id !== soundIdToFilter)

const initSoundPosition = {
  seek: 0,
  duration: 0
}

const initialState = {
  sounds: [],
  currentId: null,
  mode: null,
  isPlaying: false,
  isMuted: false,
  soundPosition: clone(initSoundPosition),
  randomSeed: 0,
  playerPlayingNowVisible: false
}

export const soundPlayerModule = {
  state: clone(initialState),

  getters: {
    soundPlayingTime: flow(
      get('soundPosition.seek'),
      convertSoundPositionToPlayTime
    ),
    seekRelativeDecimal: flow(get('soundPosition'), getDecimalSoundProgress),
    soundPlayerSounds: state => getSoundsList(state)
  },

  actions: {
    addSoundToPlayer: addSoundToPlayerAction,
    moveSound: moveSoundAction,
    changeSoundAfterFinished: changeSoundAfterFinishedAction,
    playWithReset: ({ dispatch }, { sound }) => {
      dispatch('resetSound')
      dispatch('addSoundToPlayer', { sound })
    },
    playFeedWithReset: ({ dispatch }, { sounds }) => {
      dispatch('resetSound')
      sounds.forEach(sound => dispatch('addSoundToPlayer', { sound }))
    },
    resetSound: ({ commit }) => {
      commit('RESET_SOUND')
    },
    changeSoundToPlay: ({ commit, state, dispatch }, { soundId }) => {
      const sound = findSoundById(soundId)(state.sounds)

      if (sound) {
        commit('CHANGE_CURRENT_SOUND_ID', soundId)
        dispatch('playNew')
      }
    },
    // do not call in code, this is used to update the UI
    changeSoundPosition: ({ commit }, { duration, seek }) => {
      commit('CHANGE_SOUND_POSITION', { duration, seek })
    },
    removeSound: ({ state, commit }, { soundId }) => {
      const sound = findSoundById(soundId)(state.sounds)

      if (sound && sound.id !== state.currentId) {
        commit('REMOVE_SOUND_FROM_PLAYER_PLAYLIST', soundId)
      }
    },
    playNew: ({ commit, state }) => {
      const sound = findSoundById(state.currentId)(state.sounds)

      player.playSound(sound.soundUrl)
      commit('PLAY_PLAYER', true)
      commit('RESET_SOUND_POSITION', true)

      startPlayingSound(sound.id).then(
        ({
          data: {
            startPlayingSound: { soundPlayingId }
          }
        }) => {
          setTimeout(() => {
            if (state.isPlaying) countPlayingSound(sound.id, soundPlayingId)
          }, 1000 * 6)
        }
      )
    },
    play: ({ commit, state }) => {
      if (!hasSounds(state)) return null

      player.continueCurrentSound()
      commit('PLAY_PLAYER', true)
    },
    pause: ({ commit, state }) => {
      if (!hasSounds(state)) return null

      player.pauseCurrentSound()
      commit('PLAY_PLAYER', false)
    },
    playerSeekRelativeDecimal: ({ commit, state }, amountInRelativeDecimal) => {
      const newSeek = state.soundPosition.duration * amountInRelativeDecimal
      player.seekCurrentSound(newSeek)
      commit('CHANGE_SEEK', { seek: newSeek })
    },
    playerStepForward: ({ dispatch }) => dispatch('playerPlayNext'),
    playerPlayNext: playerPlayRelativeByKeyIndex(1),
    playerPlayPrevious: playerPlayRelativeByKeyIndex(-1),
    playerStepBackward: ({ dispatch, state, getters }) => {
      if (
        state.soundPosition.seek < 5 &&
        !isFirstSound(state.currentId)(getters.soundPlayerSounds)
      ) {
        dispatch('playerPlayPrevious')
      } else {
        dispatch('playNew')
      }
    },
    mutePlayer: ({ commit }) => {
      player.muteSound()
      commit('MUTE_PLAYER', true)
    },
    unmutePlayer: ({ commit }) => {
      player.unmuteSound()
      commit('MUTE_PLAYER', false)
    },
    changePlayerMode: ({ commit }, { mode }) => {
      if (isValidMode(mode)) commit('CHANGE_PLAYER_MODE', mode)
      if (mode === RANDOM_MODE) commit('RANDOMIZE_PLAYLIST')
    },
    openPlayerPlayingNowList: ({ commit }) =>
      commit('OPEN_PLAYER_PLAYING_NOW_LIST'),
    closePlayerPlayingNowList: ({ commit }) =>
      commit('CLOSE_PLAYER_PLAYING_NOW_LIST')
  },

  mutations: {
    RESET_SOUND (state) {
      Object.keys(initialState).forEach(stateKey => {
        state[stateKey] = clone(initialState[stateKey])
      })
    },
    CHANGE_PLAYER_MODE (state, mode) {
      state.mode = mode
    },
    PLAY_PLAYER (state, isPlaying) {
      state.isPlaying = isPlaying
    },
    MUTE_PLAYER (state, isMuted) {
      state.isMuted = isMuted
    },
    ADD_SOUND_TO_PLAYER_PLAYLIST (state, { sounds, positionIndex }) {
      if (!state.currentId) state.currentId = sounds[0].id

      if (positionIndex) {
        state.sounds.splice(positionIndex, 0, ...sounds)
      } else {
        state.sounds = state.sounds.concat(sounds)
      }
    },
    MOVE_SOUND_PLAYER_POSITION (
      state,
      { newPositionIndex, currentPositionIndex }
    ) {
      const soundToMove = state.sounds[currentPositionIndex]

      state.sounds[currentPositionIndex] = state.sounds[newPositionIndex]
      state.sounds[newPositionIndex] = soundToMove
      state.sounds = state.sounds.sort()
    },
    CHANGE_CURRENT_SOUND_ID (state, soundId) {
      state.currentId = soundId
    },
    REMOVE_SOUND_FROM_PLAYER_PLAYLIST (state, soundId) {
      state.sounds = filterOutSoundById(soundId)(state.sounds)
    },
    RESET_SOUND_POSITION (state) {
      state.soundPosition = clone(initSoundPosition)
    },
    CHANGE_SEEK (state, { seek }) {
      state.soundPosition.seek = seek
    },
    CHANGE_SOUND_POSITION (state, { duration, seek }) {
      state.soundPosition.seek = seek
      state.soundPosition.duration = duration
    },
    RANDOMIZE_PLAYLIST (state) {
      state.randomSeed = Math.random()
    },
    OPEN_PLAYER_PLAYING_NOW_LIST (state) {
      state.playerPlayingNowVisible = true
    },
    CLOSE_PLAYER_PLAYING_NOW_LIST (state) {
      state.playerPlayingNowVisible = false
    }
  }
}
