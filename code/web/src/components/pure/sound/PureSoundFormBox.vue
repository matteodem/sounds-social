<template>
  <div>
    <div v-if="hasFile" class="ba bw1 b--light-gray br2 ph3 mw8">
      <div class="pv3 b gray" v-if="isUploading">
        <pure-loader-text>
          <div v-text="`${$t('Sound uploading')}...`"></div>
        </pure-loader-text>
      </div>
      <div class="pv3 b gray i" v-if="!isUploading" v-text="$t('Sound uploaded')"></div>

      <div class="pointer">
        <div class="dib v-mid pr2">
          <i class="fa fa-play" aria-hidden="true"></i>
        </div>
        <input
                type="text"
                :value="name"
                class="h2 f3 b bn lh-copy black mv2 dim navy"
                @change="$emit('changeTitle', $event.target.value)"
                :placeholder="$t('Sound name')" />
      </div>
      <div class="description username f5 gray">
        <span v-text="$t('by')"></span>
        <select class="dim pointer bg-transparent b--black-20 gray dib v-mid"
                @change="$emit('changeUploader', $event.target.value)">
          <option
            :key="option.value"
            v-for="option in uploaderOptions"
            :value="option.value"
            :selected="option.value === uploaderId"
            v-text="option.label"></option>
        </select></div>

      <textarea
              class="mt4 f5 black-80 lh-copy measure-wide bn w-50"
              type="text"
              @change="$emit('changeDescription', $event.target.value)"
              style="min-height: 150px"
              v-text="description"
              :placeholder="`${$t('Sound description')}...`"></textarea>

      <div class="pv3">
        <pure-button :disabled="isUploading" @click="$emit('publish')">{{buttonLabel}}</pure-button>
        <slot name="additionalButtons"></slot>
      </div>
    </div>
    <div v-if="!hasFile">
      <upload-zone
              :label="$t('Click here to upload sound')"
              @upload="$emit('uploadFile', arguments[0])"></upload-zone>
    </div>
  </div>
</template>
<script>
  import { collectionHasFields } from '../../../func/collectionHasFields'

  export default {
    props: {
      username: {
        type: String,
        required: true,
      },
      groups: {
        type: Array,
        default () {
          return []
        },
        validator: collectionHasFields(['_id', 'name'])
      },
      hasFile: {
        type: Boolean,
        default: false,
      },
      isUploading: {
        type: Boolean,
        default: true,
      },
      name: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      uploaderId: {
        type: String,
        required: false,
      },
      buttonLabel: {
        type: String,
        default () {
          return this.$t('Publish')
        },
      }
    },
    computed: {
      uploaderOptions () {
        return [
          { label: this.username, value: 'user' },
          ...this.groups.map(group => ({ label: group.name, value: group._id })),
        ]
      },
    },
  }
</script>
