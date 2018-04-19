<template>
  <layout-with-sidebar>
    <div slot="header">
      <header-component current="sounds"></header-component>
    </div>
    <div slot="main">
      <div v-if="Object.keys(formData)" class="f3 mw7">
        <pure-title v-text="$t('Edit playlist')"></pure-title>

        <form-field :label="$t('Name')" :error="$v.formData.name">
          <pure-input
            name="name"
            @keyup="changeFormData('name', arguments[0])"
            :value="formData.name"></pure-input>
        </form-field>

        <form-field :label="$t('Description')" :error="$v.formData.description">
            <textarea
              class="w-100"
              style="height: 180px"
              name="description"
              @change="changeFormData('description', $event.target.value)"
              v-text="formData.description"></textarea>
        </form-field>

        <label-input :label="$t('Public')">
          <input type="checkbox"
                 :checked="formData.isPublic"
                 @change="formData.isPublic = $event.target.checked" />
        </label-input>

        <label-input :label="$t('Sounds')">
          <draggable-list
            alias="sounds"
            :data="formData.sounds"
            getId="_id"
            getLabel="name"
            @change="formData.sounds = arguments[0]"
            @remove="removeSound(arguments[0]._id)"
          ></draggable-list>
        </label-input>

        <div class="mv4">
          <pure-button
            @click="updatePlaylist"
            :disabled="$v.$invalid"
            v-text="$t('Update playlist')"
          ></pure-button>
        </div>
      </div>
    </div>
  </layout-with-sidebar>
</template>
<script>
  import Draggable from 'vuedraggable'
  import { pick, get } from 'lodash/fp'
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  import HeaderComponent from '../../stateful/StatefulHeader.vue'
  import { updatePlaylist, playlistEditQuery } from '../../../api/PlaylistApi'

  const pickFields = pick(['playlistId', 'sounds', 'name', 'description', 'isPublic'])

  export default {
    components: {
      HeaderComponent,
      Draggable,
    },
    metaInfo () {
      return {
        title: this.$t('Edit profile'),
      }
    },
    data () {
      return {
        formData: {},
      }
    },
    apollo: {
      playlistEdit: {
        query: playlistEditQuery,
        variables () {
          return { id: this.$route.params.id }
        },
        fetchPolicy: 'network-only',
      },
    },
    watch: {
      playlistEdit () {
        this.formData = pickFields(this.playlistEdit)
        this.formData.sounds = this.formData.sounds.map(pick(['_id', 'name']))
      },
    },
    validations: {
      formData: {
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
        description: {
          maxLength: maxLength(280),
        },
      },
    },
    methods: {
      changeFormData (field, value) {
        this.$v.formData[field].$touch()
        this.formData[field] = value
      },
      removeSound (soundId) {
        this.formData.sounds = this.formData.sounds.filter(
          ({ _id }) => _id !== soundId,
        )
      },
      updatePlaylist () {
        const { formData } = this

        updatePlaylist({
          ...formData,
          soundIds: formData.sounds.map(get('_id')),
        }).then(({ data: { playlist } }) => {
          this.$router.push({
            name: 'playlist-detail',
            params: { id: playlist._id },
          })
        })
      },
    },
  }
</script>
