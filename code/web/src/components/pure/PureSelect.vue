<template>
  <div class="f4">
    <v-select :value="currentValue"
              :on-change="onChange"
              :on-search="onSearch"
              :placeholder="placeholder"
              :options="options"></v-select>
  </div>
</template>
<script>
  import { find } from 'lodash/fp'
  import { collectionHasLabelAndValue } from '../../func/collectionHasFields'

  export default {
    props: {
      options: {
        type: Array,
        validator: collectionHasLabelAndValue,
      },
      current: {
        type: String,
        required: false,
      },
      placeholder: {
        type: String,
        required: false,
      },
    },
    computed: {
      currentValue () {
        return find(({ value }) => value === this.current)(this.options)
      },
    },
    methods: {
      onChange (val) {
        this.$emit('change', val)
      },
      onSearch (val, isLoading) {
        this.$emit('search', val, isLoading)
      },
    },
  }
</script>
