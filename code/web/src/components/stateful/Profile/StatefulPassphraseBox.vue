<template>
  <div>
    <div class="tc f3" v-if="!passphrase">Loading...</div>
    <div class="tc f2  white pa3 bg-light-gray" v-if="passphrase" v-text="passphrase"></div>
  </div>
</template>
<script>
  import { getUserPassphrase } from '../../../api/UserApi'

  export default {
    data () {
      return {
        passphrase: '',
      }
    },
    mounted () {
      getUserPassphrase().then(passphrase => {
        this.passphrase = passphrase
      })
    }
  }
</script>
