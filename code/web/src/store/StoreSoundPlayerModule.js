import { clone, constant, filter, find, findKey, flow, get } from 'lodash/fp'
import {
  continueCurrentSound,
  muteSound,
  pauseCurrentSound,
  playSound,
  seekCurrentSound,
  unmuteSound
} from '../func/SoundPlayer'
import { countPlayingSound, startPlayingSound } from '../api/SoundApi'
import {
  isValidMode,
  LOOP_MODE,
  LOOP_SINGLE_MODE,
  RANDOM_MODE
} from '../constants/PlayerConstants'
import { collectionHasPlaylistFields } from '../func/collectionHasFields'
import { playerPlayRelativeByKeyIndex } from './StoreSoundPlayerModule/playRelativeByKeyIndex'
import { convertSoundPositionToPlayTime } from './StoreSoundPlayerModule/convertSoundPositionToPlayTime'
import { getDecimalSoundProgress } from './StoreSoundPlayerModule/getDecimalSoundProgress'
import { getSoundsList } from './StoreSoundPlayerModule/getSoundsList'

export const findSoundKeyById = soundId =>
  findKey(sound => sound.id === soundId)
const findSoundById = soundId => find(sound => sound.id === soundId)
const hasSounds = state => state.sounds.length > 0

const filterOutSoundById = soundIdToFilter =>
  filter(sound => sound.id !== soundIdToFilter)
const isAtNthSound = nthIndex => soundId => sounds =>
  parseInt(findSoundKeyById(soundId)(sounds), 10) === nthIndex(sounds)

const isFirstSound = isAtNthSound(constant(0))
const isLastSound = isAtNthSound(sounds => sounds.length - 1)

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
    addSoundToPlayer: (
      { commit, state, getters, dispatch },
      { sound, relativePosition }
    ) => {
      if (
        collectionHasPlaylistFields([sound]) &&
        sound &&
        !findSoundById(sound.id)(state.sounds)
      ) {
        const hasSoundsInState = hasSounds(state)

        commit('ADD_SOUND_TO_PLAYER_PLAYLIST', {
          positionIndex:
            parseInt(
              findSoundKeyById(state.currentId)(getters.soundPlayerSounds),
              10
            ) + relativePosition,
          sounds: [sound]
        })

        if (!hasSoundsInState) dispatch('playNew')
        else dispatch('openPlayerPlayingNowList')
      }
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
    changeSoundAfterFinished: ({ dispatch, getters, state }) => {
      const { soundPlayerSounds: sounds } = getters
      const { mode, currentId } = state

      if (mode === LOOP_SINGLE_MODE) {
        dispatch('play')
      } else if (
        [LOOP_MODE, RANDOM_MODE].includes(mode) &&
        isLastSound(currentId)(sounds)
      ) {
        dispatch('changeSoundToPlay', { soundId: sounds[0].id })
      } else {
        dispatch('playerPlayNext')
      }
    },
    removeSound: ({ state, commit }, { soundId }) => {
      const sound = findSoundById(soundId)(state.sounds)

      if (sound && sound.id !== state.currentId) {
        commit('REMOVE_SOUND_FROM_PLAYER_PLAYLIST', soundId)
      }
    },
    moveSound: ({ commit, state }, { soundId, relativePosition }) => {
      const currentPositionIndex = parseInt(
        findSoundKeyById(soundId)(state.sounds),
        10
      )
      const newPositionIndex = currentPositionIndex + relativePosition

      if (state.mode === RANDOM_MODE) {
        throw new Error('Cannot move sounds in random mode')
      }

      if (!isNaN(currentPositionIndex) && state.sounds[newPositionIndex]) {
        console.log({
          newPositionIndex,
          currentPositionIndex
        })
        commit('MOVE_SOUND_PLAYER_POSITION', {
          newPositionIndex,
          currentPositionIndex
        })
      }
    },
    playNew: ({ commit, state }) => {
      const sound = findSoundById(state.currentId)(state.sounds)

      playSound(sound.soundUrl)
      commit('PLAY_PLAYER', true)
      commit('RESET_SOUND_POSITION', true)

      startPlayingSound(sound.id).then(
        ({ data: { startPlayingSound: { soundPlayingId } } }) => {
          setTimeout(() => {
            if (state.isPlaying) countPlayingSound(sound.id, soundPlayingId)
          }, 1000 * 6)
        }
      )
    },
    play: ({ commit, state }) => {
      if (!hasSounds(state)) return null

      continueCurrentSound()
      commit('PLAY_PLAYER', true)
    },
    pause: ({ commit, state }) => {
      if (!hasSounds(state)) return null

      pauseCurrentSound()
      commit('PLAY_PLAYER', false)
    },
    playerSeekRelativeDecimal: ({ commit, state }, amountInRelativeDecimal) => {
      const newSeek = state.soundPosition.duration * amountInRelativeDecimal
      seekCurrentSound(newSeek)
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
      muteSound()
      commit('MUTE_PLAYER', true)
    },
    unmutePlayer: ({ commit }) => {
      unmuteSound()
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
