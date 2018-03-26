<template>
  <layout-with-sidebar>
    <div slot="header">
      <header-component :current="isCurrentUser ? 'profile' : 'sounds'"></header-component>
    </div>
    <div slot="main">
      <div v-if="getUser">
        <pure-title v-text="getUser.username"></pure-title>
        <div v-if="isCurrentUser">
          <h2 class="f3 f2-ns mv3 gray" v-text="`(${$t('this is you')})`"></h2>
        </div>
        <sound-list-component
          :query="userProfileSoundsQuery"
          :defineQueryVariables="defineSoundListQueryVariables"
        ></sound-list-component>
      </div>
      <div v-if="!getUser && !userLoading">
        <div class="i" v-text="$t('User not found')"></div>
      </div>
    </div>
    <div slot="sidebar">
      <div v-if="getUser">
        <stateful-profile-box :user="getUser"></stateful-profile-box>

        <div class="mt4 mb3 tc" v-if="isCurrentUser">
          <pure-button @click="$router.push({ name: 'profile-edit', params: { id: getUser._id } })" v-text="$t('Edit profile')"></pure-button>
          <div class="dib dn-l">
            <pure-button @click="authLogOut" color="gray" v-text="$t('Logout')"></pure-button>
          </div>
        </div>

        <alias-list
          @openAlias="$router.push({ name: 'alias-detail', params: { id: arguments[0]._id } })"
          @createAlias="openAliasModal = true"
          :canCreate="isCurrentUser"
          :aliases="getUser.aliases"></alias-list>

        <stateful-playlist-list :user-id="getUser._id"></stateful-playlist-list>

        <pure-modal @close="openAliasModal = false" v-show="openAliasModal">
          <div class="pa4">
            <pure-title size="f1" v-text="$t('Create alias')"></pure-title>

            <stateful-alias-form></stateful-alias-form>
          </div>
        </pure-modal>
      </div>
    </div>
  </layout-with-sidebar>
</template>
<script type="text/ecmascript-6">
  import HeaderComponent from '../stateful/StatefulHeader.vue'
  import SoundListComponent from '../stateful/sound/StatefulSoundList.vue'
  import StatefulPlaylistList from '../stateful/Playlist/StatefulPlaylistList.vue'
  import StatefulProfileBox from '../stateful/Profile/StatefulUserProfileBox.vue'
  import StatefulAliasForm from '../stateful/Alias/StatefulAliasForm.vue'
  import { getUserId } from '../../api/AuthApi'
  import { profilePageQuery as query } from '../../api/ProfileApi'
  import { userProfileSoundsQuery } from '../../api/SoundApi'

  export default {
    components: {
      HeaderComponent,
      SoundListComponent,
      StatefulPlaylistList,
      StatefulProfileBox,
      StatefulAliasForm,
    },
    metaInfo () {
      if (this.getUser) {
        return {
          title: this.getUser.username,
        }
      }

      return {}
    },
    data () {
      return {
        openAliasModal: false,
        getUser: null,
        userLoading: 0,
        userId: '',
        userProfileSoundsQuery,
      }
    },
    mounted () {
      getUserId().then(id => {
        this.userId = id

        if (this.$route.params.id === 'me') {
          this.$router.push({ name: 'profile-detail', params: { id } })
        }
      })
    },
    apollo: {
      getUser: {
        query,
        loadingKey: 'userLoading',
        fetchPolicy: 'network-only',
        variables () {
          return { id: this.profileUserId }
        },
      },
    },
    computed: {
      isCurrentUser () {
        return this.profileUserId === this.userId
      },
      profileUserId () {
        const id = this.$route.params.id

        if (id === 'me') {
          return this.userId
        }

        return id
      },
    },
    methods: {
      defineSoundListQueryVariables () {
        return {
          userId: this.profileUserId,
        }
      },
    },
  }
</script>
