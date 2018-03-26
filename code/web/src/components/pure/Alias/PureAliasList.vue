<template>
  <div>
    <div class="tc">
      <pure-button v-if="canCreate" class="mb1 dib" @click="$emit('createAlias')" v-text="$t('Create alias')"></pure-button>
    </div>

    <h2 v-if="aliases && aliases.length" class="mb3 f3" v-text="$t('Part of')"></h2>

    <div class="overflow-y-auto cf custom-max-height-alias-list-l">
      <div :key="index" v-for="(alias, index) in aliases" class="fl w-third-m w-50 w-100-l pr2 pr0-l">
        <div class="pa2 ba bw1 b--light-gray mb2 pointer" @click="$emit('openAlias', alias)">
          <div class="dib v-mid cover"
               :style="`width: 50px; height: 50px; background-image: url(${getAliasImage(alias)})`"></div>
          <div class="dib v-mid f5 pl2" style="width: calc(100% - 55px)" v-text="alias.name"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getImage } from '../../../func/getImage'

  export default {
    props: {
      aliases: {
        type: Array,
      },
      canCreate: {
        type: Boolean,
        required: false,
      }
    },
    methods: {
      getAliasImage (alias) {
        return getImage('avatarFile.url')(alias)
      }
    }
  }
</script>
