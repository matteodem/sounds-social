<template>
  <div class="mw6">
    <form-field :label="$t('Name')" :error="$v.formData.name">
      <pure-input
        name="name"
        @keyup="changeFormData('name', arguments[0])"
        :value="formData.name"></pure-input>
    </form-field>

    <form-field :label="`${$t('Type')} (${$t('Label, Alias, Collective')}...)`" :error="$v.formData.type">
      <pure-input
        name="type"
        @keyup="changeFormData('type', arguments[0])"
        :value="formData.type"></pure-input>
    </form-field>

    <form-field :label="$t('Website Url')" :error="$v.formData.websiteUrl">
      <pure-input
        name="websiteUrl"
        @keyup="changeFormData('websiteUrl', arguments[0])"
        :value="formData.websiteUrl"></pure-input>
    </form-field>

    <form-field :label="$t('Description')" :error="$v.formData.description">
      <textarea
        class="w-100"
        style="height: 180px"
        name="description"
        v-text="formData.description"
        @change="changeFormData('description', $event.target.value)"></textarea>
    </form-field>

    <div class="mt4">
      <upload-zone
        :label="$t(`${aliasId ? 'Update' : 'Add'} alias avatar`)"
        @upload="uploadAvatarFileImage(arguments[0])"></upload-zone>

      <div v-if="hasUploadedFile" class="mt3 i mid-gray"><span v-text="$t('File uploaded')"></span>!</div>
    </div>

    <div class="mv4">
      <pure-button
        @click="saveAlias"
        :disabled="$v.$invalid"
        :fill="true"
        v-text="$t(aliasId ? 'Edit alias' : 'Create alias')"
      ></pure-button>

      <div class="dib">
        <pure-confirm-modal-button
          @confirm="removeAlias"
          v-if="aliasId"
          buttonColor="light-red">
          <div slot="button" v-text="$t('Delete alias')"></div>
        </pure-confirm-modal-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { pick } from 'lodash/fp'
  import { url, required, minLength, maxLength } from 'vuelidate/lib/validators'

  import { saveAlias, removeAlias, aliasFormDataQuery } from '../../../api/AliasApi'
  import { addAliasAvatarFile } from '../../../api/StorageApi'

  const pickFields = pick(['name', 'type', 'description', 'websiteUrl'])

  export default {
    props: {
      aliasId: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        hasUploadedFile: false,
        formData: {
          name: '',
          type: '',
          description: '',
          websiteUrl: '',
        },
      }
    },
    apollo: {
      aliasFormData () {
        return {
          query: aliasFormDataQuery,
          variables () {
            return { id: this.aliasId }
          },
          skip: !this.aliasId,
          fetchPolicy: 'network-only',
        }
      },
    },
    watch: {
      aliasFormData () {
        if (this.aliasId) {
          this.formData = pickFields(this.aliasFormData)
        }
      },
    },
    validations: {
      formData: {
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
        websiteUrl: {
          url,
          maxLength: maxLength(50),
        },
        type: {
          minLength: minLength(3),
          maxLength: maxLength(40),
        },
        description: {
          maxLength: maxLength(280),
        },
      },
    },
    methods: {
      changeFormData (field, value) {
        this.$v.formData[field].$touch()
        this.formData[field] = value
      },
      uploadAvatarFileImage (e) {
        const file = e.target.files[0]

        addAliasAvatarFile(file)
          .then(({ result: { _id, hash, userId } }) => {
            this.formData.avatarFile = { _id, hash, userId }
            this.hasUploadedFile = !!_id
          })
          .catch(() => alert(this.$t('Wrong file format')))
      },
      saveAlias () {
        const { name, type, avatarFile, description, websiteUrl } = this.formData

        saveAlias(this.aliasId, name, type, websiteUrl, avatarFile, description)
          .then(({ data: { alias } }) => this.$router.push({
            name: 'alias-detail',
            params: { id: alias._id },
          }))
      },
      removeAlias () {
        removeAlias(this.aliasId)
          .then(({ data: { alias } }) => this.$router.push({
            name: 'profile-detail',
            params: { id: 'me' },
          }))
      }
    },
  }
</script>
