<template>
  <div class="mw6">
    <form-field :label="$t('Name')" :error="$v.formData.name">
      <pure-input
        name="name"
        @keyup="changeFormData('name', arguments[0])"
        :value="formData.name"></pure-input>
    </form-field>

    <form-field :label="`${$t('Type')} (${$t('Label, Alias, Collective')}...)`" :error="$v.formData.type">
      <pure-input
        name="type"
        @keyup="changeFormData('type', arguments[0])"
        :value="formData.type"></pure-input>
    </form-field>

    <form-field :label="$t('Website Url')" :error="$v.formData.websiteUrl">
      <pure-input
        name="websiteUrl"
        @keyup="changeFormData('websiteUrl', arguments[0])"
        :value="formData.websiteUrl"></pure-input>
    </form-field>

    <form-field :label="$t('Description')" :error="$v.formData.description">
      <textarea
        class="w-100"
        style="height: 180px"
        name="description"
        v-text="formData.description"
        @change="changeFormData('description', $event.target.value)"></textarea>
    </form-field>

    <div class="mt4">
      <upload-zone
        :label="$t(`${aliasId ? 'Update' : 'Add'} alias avatar`)"
        @upload="uploadAvatarFileImage(arguments[0])"></upload-zone>

      <div v-if="hasUploadedFile" class="mt3 i mid-gray"><span v-text="$t('File uploaded')"></span>!</div>
    </div>

    <form-field :label="$t('Members')" :error="$v.formData.members">
      <div class="mt3 lh-copy pa3 b--black-10 ba">
        <alias-member-list
          alias="members"
          :isRemovable="isMemberRemovable"
          :members="formData.members"
          @changeMembers="formData.members = arguments[0]"
          @removeMember="removeMember(arguments[0])"
        ></alias-member-list>

        <div v-if="formData.invitedMembers && formData.invitedMembers.length">
          <h5 class="f4 mt3 mb2" v-text="$t('Invited members')"></h5>

          <alias-member-list
            alias="invitedMembers"
            :members="formData.invitedMembers"
            @changeMembers="formData.invitedMembers = arguments[0]"
            @removeMember="removeMember(arguments[0], 'invitedMembers')"
          ></alias-member-list>
        </div>

        <!-- FIXME Create utility for array checking or see if theres an es2017 method -->
        <div v-if="newlyInvitedMembers && newlyInvitedMembers.length">
          <h5 class="f4 mt3 mb2" v-text="$t('Newly invited members')"></h5>

          <draggable-list
            alias="newlyInvitedMembers"
            :data="newlyInvitedMembers"
            getId="value"
            getLabel="label"
            @change="newlyInvitedMembers = arguments[0]"
            @remove="removeInvitedMember(arguments[0].value)"
          ></draggable-list>
        </div>

        <stateful-user-search-select
          @addUser="addMember"
          :placeholder="$t('Invite member')"
        ></stateful-user-search-select>
      </div>
    </form-field>

    <div class="mv4">
      <pure-button
        @click="saveAlias"
        :disabled="$v.$invalid"
        :fill="true"
        v-text="$t(aliasId ? 'Edit alias' : 'Create alias')"
      ></pure-button>

      <div class="dib">
        <pure-confirm-modal-button
          @confirm="removeAlias"
          v-if="aliasId"
          buttonColor="light-red">
          <div slot="button" v-text="$t('Delete alias')"></div>
        </pure-confirm-modal-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { pick, filter, map, get, uniq } from 'lodash/fp'
  import { url, required, minLength, maxLength } from 'vuelidate/lib/validators'
  import { saveAlias, removeAlias, aliasFormDataQuery } from '../../../api/AliasApi'
  import { addAliasAvatarFile } from '../../../api/StorageApi'
  import StatefulUserSearchSelect from '../User/StatefulUserSearchSelect.vue'

  const pickFields = pick(['name', 'type', 'description', 'websiteUrl', 'members', 'invitedMembers'])
  const mapId = map(get('_id'))

  export default {
    components: { StatefulUserSearchSelect },
    props: {
      aliasId: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        hasUploadedFile: false,
        formData: {
          name: '',
          type: '',
          description: '',
          websiteUrl: '',
          members: [],
          invitedMembers: [],
        },
        newlyInvitedMembers: [],
      }
    },
    apollo: {
      aliasFormData () {
        return {
          query: aliasFormDataQuery,
          variables () {
            return { id: this.aliasId }
          },
          skip: !this.aliasId,
          fetchPolicy: 'network-only',
        }
      },
    },
    watch: {
      aliasFormData () {
        if (this.aliasId) {
          this.formData = pickFields(this.aliasFormData)
        }
      },
    },
    validations: {
      formData: {
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
        websiteUrl: {
          url,
          maxLength: maxLength(50),
        },
        type: {
          minLength: minLength(3),
          maxLength: maxLength(40),
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
      uploadAvatarFileImage (e) {
        const file = e.target.files[0]

        addAliasAvatarFile(file)
          .then(({ result: { _id, hash, userId } }) => {
            this.formData.avatarFile = { _id, hash, userId }
            this.hasUploadedFile = !!_id
          })
          .catch(() => alert(this.$t('Wrong file format')))
      },
      saveAlias () {
        const { name, type, avatarFile, description, websiteUrl } = this.formData
        const { memberIds, invitedMemberIds } = this.getMemberSaveData()

        saveAlias(this.aliasId, name, type, websiteUrl, avatarFile, description, memberIds, invitedMemberIds)
          .then(({ data: { alias } }) => this.$router.push({
            name: 'alias-detail',
            params: { id: alias._id },
          }))
      },
      removeAlias () {
        removeAlias(this.aliasId)
          .then(({ data: { alias } }) => this.$router.push({
            name: 'profile-detail',
            params: { id: 'me' },
          }))
      },
      getMemberSaveData () {
        return {
          memberIds: mapId(this.formData.members),
          invitedMemberIds: uniq([
            ...mapId(this.formData.invitedMembers),
            ...map(get('value'))(this.newlyInvitedMembers),
          ]),
        }
      },
      addMember (member) {
        const { members, invitedMembers } = this.formData

        if (mapId([...members, ...invitedMembers]).includes(member.value)) {
          alert('User already a member or invited!')
          return null
        }

        this.newlyInvitedMembers.push(member)
      },
      removeMember (_id, memberField = 'members') {
        const filterOnSameId = filter(member => member._id !== _id)
        this.formData[memberField] = filterOnSameId(this.formData[memberField])
      },
      removeInvitedMember (_id) {
        const filterOnSameValue = filter(member => member.value !== _id)
        this.newlyInvitedMembers = filterOnSameValue(this.newlyInvitedMembers)
      },
      isMemberRemovable ({ _id }) {
        return _id !== this.currentUserId
      },
    },
  }
</script>
