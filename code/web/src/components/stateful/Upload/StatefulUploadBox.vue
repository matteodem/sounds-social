<template>
  <div>
    <div id="soundUploadBox">
      <sound-form-box
        :username="data.username"
        :aliases="aliasOptionData"
        :hasFile="data.hasFile"
        :isUploading="data.isUploading"
        :name="data.name"
        :description="data.description"
        :uploaderId="data.uploader"
        @changeTitle="changeField('name')(arguments[0])"
        @changeDescription="changeField('description')(arguments[0])"
        @changeUploader="changeField('uploader')(arguments[0])"
        @publish="saveSound(true)"
        @uploadFile="uploadMusicFile(arguments[0])"
      >
        <div class="dib ml1" slot="additionalButtons">
          <pure-button color="gray" :disabled="data.isUploading" @click="saveSound(false)" v-text="`${$t('Save')} (${$t('Private')})`"></pure-button>
        </div>
      </sound-form-box>
    </div>
    <div class="dn">
      <input type="file" name="data" id="fileUploadInput" />
    </div>
  </div>
</template>
<script>
  import { getUsername, getUserId } from '../../../api/AuthApi'
  import { addMusicFile } from '../../../api/StorageApi'
  import { aliasOptionDataQuery } from '../../../api/AliasApi'
  import { createSound } from '../../../api/SoundApi'

  export default {
    mounted () {
      getUsername().then(this.changeField('username'))
      getUserId().then(this.changeField('userId'))
    },
    apollo: {
      aliasOptionData: {
        query: aliasOptionDataQuery,
      }
    },
    computed: {
      data () {
        return this.$store.state.uploadSound
      },
    },
    methods: {
      changeField (key) {
        return value => this.$store.dispatch('changeUploadSoundField', { key, value })
      },
      uploadMusicFile (e) {
        const file = e.target.files[0]

        const changeHasFile = this.changeField('hasFile')
        const changeIsUploading = this.changeField('isUploading')

        changeHasFile(true)
        changeIsUploading(true)

        addMusicFile(file)
          .then(({ result: { _id, hash, userId } }) => {
            this.changeField('file')({ _id, hash, userId })
            this.changeField('fileId')(_id)
            changeIsUploading(false)
          })
          .catch(() => {
            changeIsUploading(false)
            changeHasFile(false)
            alert(this.$t('Wrong file format'))
          })
      },
      saveSound (isPublic) {
        const { name, userId, uploader, description, file } = this.data

        const isUser = uploader === 'user'

        createSound({ name, description, file, aliasId: isUser ? null : uploader, creatorId: userId, isPublic })
          .then((data) => (data.data.createSound ? this.$router.push({
            name: 'sound-detail',
            params: {
              id: data.data.createSound._id,
            },
          }) : null))
          .then(() => this.$store.dispatch('resetUploadSound'))
      },
    },
  }
</script>
