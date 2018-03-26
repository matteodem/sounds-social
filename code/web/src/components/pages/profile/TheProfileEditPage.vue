<template>
  <layout-with-sidebar>
    <div slot="header">
      <header-component current="profile"></header-component>
    </div>
    <div slot="main">
      <div v-if="formData && getUser" class="f3 mw7">
        <h2 class="f1 lh-solid mv0 gray" v-text="`${$t('Edit profile')}:`"></h2>
        <pure-title v-text="getUser.username"></pure-title>

        <div class="mt4">
          <upload-zone
                  :label="$t('Update profile avatar')"
                  @upload="uploadAvatarFileImage(arguments[0])"></upload-zone>

          <div v-if="hasUploadedFile" class="mt3 i mid-gray"><span v-text="$t('File uploaded')"></span>!</div>
        </div>

        <form-field :label="$t('Description')" :error="$v.formData.description">
          <textarea
            class="w-100"
            style="height: 130px"
            name="description"
            v-text="formData.description"
            @keyup="changeFormData('description', $event.target.value)"></textarea>
        </form-field>

        <form-field :label="$t('Name')" :error="$v.formData.profileName">
          <pure-input
            name="profileName"
            @keyup="changeFormData('profileName', arguments[0])"
            :value="formData.profileName"></pure-input>
        </form-field>

        <form-field :label="$t('Website Url')" :error="$v.formData.websiteUrl">
          <pure-input
            name="websiteUrl"
            @keyup="changeFormData('websiteUrl', arguments[0])"
            :value="formData.websiteUrl"></pure-input>
        </form-field>

        <form-field :label="$t('Profile Language')">
          <pure-select
            :current="formData.language"
            :options="languageOptions"
            @change="formData.language = arguments[0].value"></pure-select>
        </form-field>

        <div class="mv4">
          <pure-button
            @click="updateProfile"
            :disabled="$v.$invalid"
            v-text="$t('Update profile')"
          ></pure-button>
        </div>
      </div>
    </div>
  </layout-with-sidebar>
</template>
<script>
  import gql from 'graphql-tag'
  import { url, maxLength, minLength } from 'vuelidate/lib/validators'

  import HeaderComponent from '../../stateful/StatefulHeader.vue'
  import { addProfileAvatarFile } from '../../../api/StorageApi'
  import { updateProfile } from '../../../api/ProfileApi'
  import { changeLanguage } from '../../../api/localStorage/LanguageStorage'
  import { initI18N } from '../../../plugins/I18NPlugin'

  const query = gql`
    query ProfilePage($id: String!) {
      getUser(_id: $id) {
        _id
        username
        isFollowedByCurrentUser
        profile {
          profileName
          description
          websiteUrl
          language
        }
      }
    }
  `

  export default {
    components: {
      HeaderComponent,
    },
    metaInfo () {
      return {
        title: this.$t('Edit profile'),
      }
    },
    data () {
      return {
        getUser: null,
        userId: '',
        hasUploadedFile: false,
        formData: {},
        languageOptions: [
          { label: 'English (Default)', value: 'en' },
          { label: 'Deutsch', value: 'de' },
        ],
      }
    },
    apollo: {
      getUser: {
        query,
        variables () {
          return { id: this.$route.params.id }
        },
      },
    },
    validations: {
      formData: {
        websiteUrl: {
          url,
          maxLength: maxLength(50),
        },
        description: {
          maxLength: maxLength(180),
        },
        profileName: {
          minLength: minLength(3),
          maxLength: maxLength(40),
        },
      },
    },
    mounted () {
      this.$apollo.query({
        query,
        variables: {
          id: this.$route.params.id,
        },
      }).then(({ data }) => {
        this.formData = this.$_.pick(
          data.getUser.profile,
          ['description', 'websiteUrl', 'language', 'profileName'],
        )
      })
    },
    methods: {
      uploadAvatarFileImage (e) {
        const file = e.target.files[0]

        addProfileAvatarFile(file)
          .then(({ _id, secret, url }) => {
            this.formData.avatarFile = { _id, secret, url }
            this.hasUploadedFile = !!_id
          })
          .catch(() => alert(this.$t('Wrong file format')))
      },
      changeFormData (field, value) {
        this.$v.formData[field].$touch()
        this.formData[field] = value
      },
      updateProfile () {
        const profileUpdateData = this.formData

        updateProfile(profileUpdateData).then(({ data: { updateUserProfile } }) => {
          this.$router.push({
            name: 'profile-detail',
            params: { id: this.$route.params.id },
          })
          changeLanguage(updateUserProfile.language)
          initI18N()
        })
      },
    },
  }
</script>
