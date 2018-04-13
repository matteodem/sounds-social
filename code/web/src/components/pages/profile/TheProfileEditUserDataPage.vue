<template>
  <layout-default>
    <div slot="header">
      <header-component current="profile"></header-component>
    </div>
    <div slot="main">
      <pure-title size="f-subheadline" v-text="$t('Manage user data')"></pure-title>

      <div class="cf mw-none-l mw6">
        <div class="fl w-50-l w-100">
          <h2 v-text="$t('Export data')"></h2>

          <p class="lh-copy">
            <span v-text="$t('This will download a JSON file, which allows you to see all the data Sounds Social has stored about you.')"></span>
          </p>

          <pure-button @click="downloadExport" :fill="true" v-text="$t('Export')"></pure-button>
        </div>
        <div class="fl w-50-l w-100">
          <h2 class="orange" v-text="$t('Delete user')"></h2>

          <p class="lh-copy">
            <span v-text="$t('Want to leave Sounds Social?')"></span>
            <br />
            <span v-text="$t('You will be guided through a simple process to do just that.')"></span>
          </p>

          <pure-button @click="startDeleteProcess" color="red" v-text="$t('Delete')"></pure-button>
        </div>
      </div>

      <pure-button class="mt4" @click="$routeNavigator.openProfileEdit($route.params.id, 'user')"
                   v-text="$t('Back to profile settings')"></pure-button>
    </div>
  </layout-default>
</template>
<script>
  import HeaderComponent from '../../stateful/StatefulHeader.vue'

  export default {
    components: {
      HeaderComponent,
    },
    metaInfo () {
      return {
        title: this.$t('User data'),
      }
    },
    methods: {
      downloadExport () {

      },
      startDeleteProcess () {

      },
    },
  }
</script>
