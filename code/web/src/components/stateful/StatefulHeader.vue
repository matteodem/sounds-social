<template>
  <div>
    <div class="shadow-1">
      <pure-header
        ref="pureHeader"
        :active-item-id="current"
        :is-logged-in="userIsAuthenticated"
        :search-query="searchQuery"
        :menu-items="menuItems"
        @search="doSearch"
        @logout="authLogOut"></pure-header>
    </div>

    <stateful-sound-player
      @openSound="$router.push({ name: 'sound-detail', params: { id: arguments[0] } })"
      @openProfile="openProfile"
    ></stateful-sound-player>
  </div>
</template>
<script>
  import { find } from 'lodash/fp'
  import StatefulSoundPlayer from './sound/StatefulSoundPlayer.vue'

  export default {
    components: {
      StatefulSoundPlayer,
    },
    props: {
      current: {
        type: String,
        required: true,
      },
    },
    computed: {
      searchQuery () {
        if (this.$route.name === 'search') return this.$route.query.q
      },
      menuItems () {
        const { isUploading, hasFile } = this.$store.state.uploadSound

        let uploadLabel = this.$t('Upload')

        if (isUploading) {
          uploadLabel = `${this.$t('Uploading')}...`
        } else if (hasFile) {
          uploadLabel = this.$t('Uploaded')
        }

        return [
          {
            id: 'upload',
            href: { name: 'upload' },
            label: uploadLabel,
          },
          {
            id: 'sounds',
            href: { name: (this.userIsAuthenticated ? 'home' : 'discover') },
            label: this.$t('Sounds'),
          },
          {
            id: 'profile',
            href: { name: 'profile-detail', params: { id: 'me' } },
            label: this.$t('Profile'),
          },
        ]
      },
    },
    methods: {
      openProfile (byId) {
        const sound = find({ byId })(this.$store.state.soundPlayer.sounds)

        this.$routeNavigator.openProfile(byId, sound.byType)
      },
      doSearch (q) {
        this.$router.push({ name: 'search', query: { q } })
      },
    },
  }
</script>
