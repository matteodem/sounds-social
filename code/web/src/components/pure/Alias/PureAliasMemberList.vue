<template>
  <div>
    <draggable-list
      :alias="alias"
      :data="members"
      getId="_id"
      :getLabel="getMemberLabel"
      :isRemovable="isRemovable"
      @change="$emit('changeMembers', arguments[0])"
      @remove="$emit('removeMember', arguments[0]._id)"
    ></draggable-list>
  </div>
</template>
<script>
  export default {
    props: {
      alias: {
        type: String,
      },
      members: {
        type: Array,
      },
      isRemovable: {
        type: Function,
        optional: true,
      },
    },
    methods: {
      getMemberLabel ({ displayName, username }) {
        return `${displayName} (${username})`
      },
    },
  }
</script>
