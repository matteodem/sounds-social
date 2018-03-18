import { clone } from 'lodash/fp'

const initialState = {
  hasFile: false,
  isUploading: false,
  username: '',
  name: '',
  description: '',
  file: {},
  groupOptionData: [],
  uploader: 'user',
  userId: '',
  fileId: ''
}

export const uploadSoundModule = {
  state: clone(initialState),
  actions: {
    changeUploadSoundField ({ commit }, { key, value }) {
      commit('UPLOAD_SOUND_CHANGE_FIELD', { key, value })
    },
    resetUploadSound ({ commit }) {
      commit('UPLOAD_SOUND_RESET')
    }
  },
  mutations: {
    UPLOAD_SOUND_CHANGE_FIELD (state, { key, value }) {
      state[key] = value
    },
    UPLOAD_SOUND_RESET (state) {
      Object.keys(clone(initialState)).forEach(key => {
        state[key] = initialState[key]
      })
    }
  }
}
