<template>
  <div>
    <pure-modal v-show="modalOpen" @close="closeModal">
      <div class="pa4">
        <h2 class="tc f2" v-text="`${$t('Let\'s stay in contact')}! 💬`"></h2>

        <div class="mt3 mw5 center">
          <pure-input @onEnter="signUpForNewsletter" @keyup="email = arguments[0]" :value="email" placeholder="Email"></pure-input>
        </div>

        <div class="mt4 tc">
          <pure-button @click="signUpForNewsletter" :disabled="!email" v-text="$t('Sign up for newsletter')"></pure-button>
        </div>
      </div>
    </pure-modal>
  </div>
</template>
<script>
  import { signUp } from '../../../api/NewsletterApi'

  export default {
    data () {
      return {
        modalOpen: false,
        email: '',
      }
    },
    methods: {
      openModal () {
        this.modalOpen = true
      },
      closeModal () {
        this.modalOpen = false
      },
      throwError () {
        alert('Could\'t add you to the newsletter')
      },
      signUpForNewsletter () {
        signUp({ email: this.email })
          .then(({ data: { addToNewsletter: { isSuccessful } } }) => {
            if (!isSuccessful) {
              this.throwError()
              return null
            }
            this.email = ''
            this.closeModal()
            this.$emit('signUp')
          })
          .catch(this.throwError) // TODO: throw error on server side and use catch for message
      },
    },
  }
</script>
