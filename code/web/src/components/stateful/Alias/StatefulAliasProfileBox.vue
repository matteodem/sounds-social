
<template>
  <pure-profile-box
    :profile="alias"
    :canFollow="alias.canFollow"
    :followerCount="alias.followerCount"
    :playCount="alias.playCount"
    :isFollowedByCurrentUser="alias.isFollowedByCurrentUser"
    @follow="follow"
    @unfollow="unfollow"
  ></pure-profile-box>
</template>
<script>
  import { follow, unfollow } from '../../../api/AliasApi'

  export default {
    props: {
      alias: {
        type: Object,
        required: true,
      },
    },
    methods: {
      follow () {
        follow(this.alias._id)
      },
      unfollow () {
        unfollow(this.alias._id)
      },
    }
  }
</script>
