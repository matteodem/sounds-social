<template>
  <div>
    <draggable v-model="internalData"
               :options="{ alias: alias }">
      <div v-for="item in internalData"
           :key="methodToString(item, 'getId')"
           class="pointer bg-silver white mb2 pv2 ph3">
        <div v-if="methodToString(item, 'isRemovable')"
             class="dib v-mid f4 mr3"
             @click="$emit('remove', item)">
          <pure-icon icon="remove"></pure-icon>
        </div>
        <span class="dib f4 v-mid" v-text="methodToString(item, 'getLabel')"></span>
      </div>
    </draggable>
  </div>
</template>
<script>
  import Draggable from 'vuedraggable'
  import { constant } from 'lodash/fp'

  export default {
    components: {
      Draggable,
    },
    props: {
      alias: {
        type: String,
      },
      data: {
        type: Array,
      },
      getId: {
        type: [String, Function],
      },
      getLabel: {
        type: [String, Function],
      },
      isRemovable: {
        type: Function,
        optional: true,
        default: constant(true),
      },
    },
    computed: {
      internalData: {
        set (val) {
          this.$emit('change', val)
        },
        get () {
          return this.data
        },
      },
    },
    methods: {
      methodToString (item, method) {
        const methodValue = this[method]

        if (typeof methodValue === 'string') return item[methodValue]

        return methodValue(item)
      },
    },
  }
</script>
