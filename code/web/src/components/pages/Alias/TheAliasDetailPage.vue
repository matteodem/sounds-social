<template>
  <layout-with-sidebar>
    <div slot="header">
      <header-component current="sounds"></header-component>
    </div>
    <div slot="main">
      <div v-if="singleAlias">
        <pure-title v-text="singleAlias.name"></pure-title>
        <h2 class="f3 f2-ns mv3 gray" v-if="singleAlias.type" v-text="singleAlias.type"></h2>
        <div v-if="singleAlias.isInvitedToJoin"
             class="mv3"
        >
          <div class="dib pv2 ph3 f6 bg-blue white" v-text="`${$t('You are invited to join this alias')}!`"></div>
          <div class="dib ml2">
            <pure-button @click="acceptInvitation" v-text="$t('Accept')"></pure-button>
          </div>
          <div class="dib ml2">
            <pure-button color="red" @click="denyInvitation" v-text="$t('Deny')"></pure-button>
          </div>
        </div>
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
  import { aliasPageQuery as query, acceptInvitation, denyInvitation } from '../../../api/AliasApi'
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
          return { id: this.aliasId }
        },
      },
    },
    computed: {
      aliasId () {
        return this.$route.params.id
      },
    },
    methods: {
      defineSoundListQueryVariables () {
        return {
          aliasId: this.aliasId,
        }
      },
      acceptInvitation () {
        acceptInvitation(this.aliasId)
      },
      denyInvitation () {
        denyInvitation(this.aliasId)
      },
    },
  }
</script>
