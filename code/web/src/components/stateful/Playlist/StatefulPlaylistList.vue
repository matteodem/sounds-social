<template>
  <div v-if="playlistList && playlistList.length">
    <h2 class="mt4 mb3 f3" v-text="$t('Playlists')"></h2>
    <div class="overflow-y-auto cf custom-max-height-playlist-list-l">
      <div :key="playlist._id" v-for="playlist in playlistList" class="fl w-third-m w-50 w-100-l pr2 pr0-l">
        <div class="pa2 ba bw1 b--light-gray mb2 pointer" @click="openPlaylist(playlist)">
          <div class="dib v-mid cover"
               :style="`width: 50px; height: 50px; background-image: url(${getPlaylistImage(playlist)})`"></div>
          <div class="dib v-mid f5 pl2" style="width: calc(100% - 55px)" v-text="playlist.name"></div>
        </div>
      </div>
    </div>

    <div v-if="!playlistLoading && !playlistList.length" v-text="$t('No {{things}} found', { things: $t('Playlists') })"></div>
  </div>
</template>
<script>
  import { playlistListQuery as query } from '../../../api/PlaylistApi'
  import { getImage } from '../../../func/getImage'

  export default {
    props: {
      userId: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        playlistLoading: 0,
      }
    },
    apollo: {
      playlistList: {
        query,
        loadingKey: 'playlistLoading',
        fetchPolicy: 'network-only',
        variables () {
          return { userId: this.userId }
        },
      },
    },
    methods: {
      getPlaylistImage (playlist) {
        return getImage('image.url')(playlist)
      },
      openPlaylist (playlist) {
        this.$router.push({ name: 'playlist-detail', params: { id: playlist._id } })
      },
    },
  }
</script>
