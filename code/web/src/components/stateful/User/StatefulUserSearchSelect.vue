<template>
  <pure-select
    :placeholder="$t('Search user')"
    :options="searchedUserOptions"
    @change="$emit('addUser', arguments[0])"
    @search="searchUsers"
  ></pure-select>
</template>
<script>
  import { searchUserSelectOptions } from '../../../api/UserApi'

  export default {
    data () {
      return {
        searchValue: '',
        searchedUserOptions: [],
      }
    },
    methods: {
      searchUsers (val, isLoading) {
        isLoading(true)

        this.searchValue = val

        searchUserSelectOptions(val).then((options) => {
          isLoading(false)
          this.searchedUserOptions = options
        })
      },
    }
  }
</script>
