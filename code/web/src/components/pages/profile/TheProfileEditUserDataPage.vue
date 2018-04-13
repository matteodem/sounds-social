<template>
  <layout-default>
    <div slot="header">
      <header-component current="profile"></header-component>
    </div>
    <div slot="main">
      <pure-title size="f-subheadline-l f1" v-text="$t('Manage user data')"></pure-title>

      <div class="cf mw-none-l mw6">
        <div class="fl w-50-l w-100">
          <h2 v-text="$t('Export data')"></h2>

          <p class="lh-copy">
            <span v-text="$t('This will download a JSON file, which allows you to see all the data Sounds Social has stored about you')"></span>.
          </p>

          <pure-button @click="downloadExport" :fill="true" v-text="$t('Export')"></pure-button>
        </div>
        <div class="fl w-50-l w-100">
          <h2 class="orange" v-text="$t('Delete user')"></h2>

          <p class="lh-copy">
            <span v-text="$t('Want to delete your user on Sounds Social?')"></span>
            <br/>
            <span v-text="$t('You will be guided through a simple process to do just that')"></span>.
          </p>

          <pure-button @click="startDeleteProcess" color="red" v-text="$t('Delete')"></pure-button>
        </div>
      </div>

      <pure-button class="mt4" @click="$routeNavigator.openProfileEdit($route.params.id, 'user')"
                   v-text="$t('Back to profile settings')"></pure-button>

      <pure-modal @close="abortDeleteProcess" v-if="openModalId === 'explain'">
        <div class="pa4">
          <div class="lh-copy">
            <modal-title v-text="$t('What will be permanently deleted?')"></modal-title>

            <span class="b" v-text="$t('Following data will be deleted forever')"></span>:
            <ul>
              <li v-text="$t('Your profile data')"></li>
              <li v-text="$t('Your playlists')"></li>
              <li v-text="$t('Your aliases (created by you)')"></li>
              <li v-text="$t('Metadata of sounds that you uploaded')"></li>
            </ul>
          </div>

          <div class="dib mr2">
            <pure-button @click="abortDeleteProcess" color="orange" v-text="$t('Abort')"></pure-button>
          </div>

          <pure-button @click="continueDeleteProcess" v-text="$t('Continue')"></pure-button>
        </div>
      </pure-modal>

      <pure-modal @close="abortDeleteProcess" v-if="openModalId === 'passphraseExplain'">
        <div class="pa4">
          <div class="lh-copy">
            <modal-title v-text="$t('What will continue being accessible?')"></modal-title>

            <span class="b" v-text="$t('Following data will still be accessible with your passphrase')"></span>:
            <ul>
              <li v-text="$t('Your uploaded sounds (audio file)')"></li>
              <li v-text="$t('Your uploaded covers, profile avatars (image files)')"></li>
            </ul>

            <span v-text="$t('The files will be inaccessible over the URL after deletion')"></span>.
            <br/>
            <span v-text="$t('Your passphrase is the key to')"></span>
            <!-- TODO: link -->
            <a class="link blue" href="/#" target="_blank" v-text="$t('access the files after deletion')"></a>.
          </div>

          <div class="mt3">
            <div class="dib mr2">
              <pure-button @click="abortDeleteProcess" color="orange" v-text="$t('Abort')"></pure-button>
            </div>

            <pure-button @click="continueDeleteProcess" v-text="$t('Continue')"></pure-button>
          </div>
        </div>
      </pure-modal>

      <pure-modal @close="abortDeleteProcess" v-if="openModalId === 'passphraseDisplay'">
        <div class="pa4">
          <div class="lh-copy">
            <modal-title v-text="$t('Write down your passphrase')"></modal-title>

            <passphrase-box></passphrase-box>

            <div class="tc mt3">
              <span v-text="$t('Your passphrase will not be recoverable after deletion')"></span>!
            </div>
          </div>

          <div class="mt3">
            <div class="dib mr2">
              <pure-button @click="abortDeleteProcess" color="orange" v-text="$t('Abort')"></pure-button>
            </div>

            <pure-button @click="continueDeleteProcess" v-text="$t('Continue')"></pure-button>
          </div>
        </div>
      </pure-modal>

      <pure-modal @close="abortDeleteProcess" v-if="openModalId === 'confirm'">
        <div class="pa4">
          <div class="lh-copy">
            <modal-title v-text="$t('Confirm deletion')"></modal-title>

            <div class="tc">
              <span v-text="$t('After careful consideration of the previous information')"></span>,
              <span v-text="$t('you can now confirm deleting your user')"></span>.
            </div>
          </div>

          <div class="mt4 tc">
            <div class="dib mr2">
              <pure-button @click="abortDeleteProcess" color="orange" v-text="$t('Abort')"></pure-button>
            </div>

            <pure-button @click="deleteUser" :fill="true" v-text="$t('Delete')"></pure-button>
          </div>
        </div>
      </pure-modal>

    </div>
  </layout-default>
</template>
<script>
  import HeaderComponent from '../../stateful/StatefulHeader.vue'
  import PassphraseBox from '../../stateful/Profile/StatefulPassphraseBox.vue'
  import { downloadUserExportData, deleteUser } from '../../../api/UserApi'

  const modalIds = ['explain', 'passphraseExplain', 'passphraseDisplay', 'confirm']

  export default {
    components: {
      HeaderComponent,
      PassphraseBox,
    },
    metaInfo () {
      return {
        title: this.$t('User data'),
      }
    },
    data () {
      return {
        openModalId: null,
      }
    },
    methods: {
      downloadExport () {
        downloadUserExportData()
      },
      startDeleteProcess () {
        this.openModalId = modalIds[0]
      },
      abortDeleteProcess () {
        this.openModalId = null
      },
      continueDeleteProcess () {
        this.openModalId = modalIds[modalIds.indexOf(this.openModalId) + 1]
      },
      deleteUser () {
        deleteUser().then(() => this.authLogOut())
      },
    },
  }
</script>
