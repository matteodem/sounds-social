<template>
  <layout-with-sidebar>
    <div slot="header">
      <header-component current="sounds"></header-component>
    </div>
    <div slot="main">
      <div v-if="singleAlias">
        <pure-title v-text="singleAlias.name"></pure-title>
        <h2 class="f3 f2-ns mv3 gray" v-text="singleAlias.type"></h2>
        <sound-list-component
          :query="aliasSoundsQuery"
          :defineQueryVariables="defineSoundListQueryVariables"></sound-list-component>
      </div>
      <div v-if="!aliasLoading && !singleAlias">
        <div class="i" v-text="$t('Alias not found')"></div>
      </div>
    </div>
    <div slot="sidebar">
      <div v-if="singleAlias">
        <stateful-profile-box :alias="singleAlias"></stateful-profile-box>

        <div class="mv4 tc" v-if="singleAlias.isEditable">
          <pure-button @click="$router.push({ name: 'alias-edit', params: { id: singleAlias._id } })" v-text="$t('Edit alias')"></pure-button>
        </div>

        <member-list
          @openMember="$router.push({ name: 'profile-detail', params: { id: arguments[0]._id } })"
          :members="singleAlias.members"></member-list>
      </div>
    </div>
  </layout-with-sidebar>
</template>
<script type="text/ecmascript-6">
  import HeaderComponent from '../../stateful/StatefulHeader.vue'
  import SoundListComponent from '../../stateful/sound/StatefulSoundList.vue'
  import StatefulProfileBox from '../../stateful/Alias/StatefulAliasProfileBox.vue'
  import { aliasPageQuery as query } from '../../../api/AliasApi'
  import { aliasSoundsQuery } from '../../../api/SoundApi'

  export default {
    components: {
      HeaderComponent,
      SoundListComponent,
      StatefulProfileBox,
    },
    metaInfo () {
      if (this.singleAlias) {
        return {
          title: this.singleAlias.name,
        }
      }

      return {}
    },
    data () {
      return {
        singleAlias: null,
        aliasLoading: 0,
        aliasSoundsQuery,
      }
    },
    apollo: {
      singleAlias: {
        query,
        loadingKey: 'aliasLoading',
        fetchPolicy: 'network-only',
        variables () {
          return { id: this.$route.params.id }
        },
      },
    },
    methods: {
      defineSoundListQueryVariables () {
        return {
          aliasId: this.$route.params.id,
        }
      },
    },
  }
</script>
