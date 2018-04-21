<template>
  <div>
    <h2 class="mt4 mb3 f3" v-text="$t('Consists of')"></h2>

    <div class="overflow-y-auto cf custom-max-height-member-list-l">
      <div :key="memberIndex" v-for="(member, memberIndex) in members" class="fl w-third-m w-50 w-100-l pr2 pr0-l">
        <div class="pa2 ba bw1 b--light-gray mb2 pointer" @click="$emit('openMember', member)">
          <div class="dib v-mid cover"
               :style="`width: 50px; height: 50px; background-image: url(${getMemberImage(member)})`"></div>
          <div class="dib v-mid f5 pl2" style="width: calc(100% - 55px)" v-text="member.displayName"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getImage } from '../../../func/getImage'

  export default {
    props: {
      members: {
        type: Array,
      },
    },
    methods: {
      getMemberImage (member) {
        return getImage('profile.avatarFile.url')(member)
      }
    }
  }
</script>
