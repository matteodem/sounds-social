<template>
  <layout-with-sidebar>
    <div slot="header">
      <header-component current="sounds"></header-component>
    </div>
    <div slot="main">
      <div class="f3 mw7">
        <pure-title v-text="$t('Edit alias')"></pure-title>

        <stateful-alias-form :aliasId="$route.params.id"></stateful-alias-form>
      </div>
    </div>
  </layout-with-sidebar>
</template>
<script>
  import HeaderComponent from '../../stateful/StatefulHeader.vue'
  import StatefulAliasForm from '../../stateful/Alias/StatefulAliasForm.vue'

  export default {
    components: {
      HeaderComponent,
      StatefulAliasForm,
    },
    metaInfo () {
      return {
        title: this.$t('Edit alias'),
      }
    },
  }
</script>
