import Vue from 'vue'
import Vuex from 'vuex'

import { soundPlayerModule } from './StoreSoundPlayerModule'
import { uploadSoundModule } from './UploadSoundModule'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    soundPlayer: soundPlayerModule,
    uploadSound: uploadSoundModule
  }
})

export default store
