<template>
  <div v-if="isAuthenticated !== null">
    <div v-if="isAuthenticated">
      <feed-component></feed-component>
    </div>

    <div v-if="!isAuthenticated">
      <div class="min-vh-100 cover items-center bg-gradient-blue" style="display: grid;">
        <div class="cf">
          <div class="fl w-50-l w-100 ph2 pv0-l pv2">
            <div class="center bg-blue white tc vh-50 br2 items-center justify-center shadow-1" style="min-height: 480px; display: grid">
              <pure-identity-header></pure-identity-header>

              <div class="center">
                <div class="lh-copy f4 f3-l tc">
                  <span v-text="$t('The open and social music platform')"></span>
                  <br />
                  <div class="f5-l f6 mt1">
                    <span v-text="$t('This project is is a')"></span> <a class="color-inherit"
                                                                         href="https://github.com/matteodem/sounds-social"
                                                                         v-text="$t('work in progress')"></a>.
                    <a href=""
                       @click.prevent="openNewsletterModal"
                       class="color-inherit"
                       v-text="`${$t('Want to stay up to date?')}`"></a>
                  </div>
                  <div class="mt3 mw5 center pa3 f6 bg-white blue tc"
                       v-show="succesfullySignedUpMessage"
                       v-text="`${$t('Success')}! ${$t('You\'ll be one of the first ones to know about news')}`"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="fl w-50-l w-100 mt0-l ph2 pv0-l pv2">
            <div class="bg-white pa3 center vh-50 br2 items-center justify-center shadow-1"  style="min-height: 480px; display: grid">
              <div style="width: 45vw">
                <stateful-sound-explore-covers></stateful-sound-explore-covers>

                <div class="mt4 center mw5">
                  <div v-if="errorType" class="mb3">
                    <pure-error><div v-text="$t('Could not {{action}}', { action: errorType })"></div></pure-error>
                  </div>

                  <pure-input @onEnter="doLogin" @keyup="username = arguments[0]" :placeholder="$t('Username')"></pure-input>
                  <div class="mt2">
                    <pure-input @onEnter="doLogin" @keyup="password = arguments[0]" type="password" :placeholder="$t('Password')"></pure-input>
                  </div>
                </div>

                <div class="mw8 center tc">
                  <div class="pv3 dib">
                    <pure-button :fill="true" @click="doLogin" v-text="$t('Login')"></pure-button>
                  </div>

                  <div class="pv3 dib">
                    <pure-button :fill="true" color="green" @click="startRegister" v-text="$t('Register')"></pure-button>

                    <pure-modal @close="openRegisterModal = false" v-show="openRegisterModal">
                      <div class="pa4 tc">
                        <h2 class="f2">Hi <span v-text="username"></span> 👋</h2>

                        <div class="f4" v-text="$t('We need your email to prove that you\'re human.')"></div>

                        <div class="mt3 mw5 center">
                          <pure-input @onEnter="doRegister" @keyup="email = arguments[0]" placeholder="Email"></pure-input>

                          <div class="mt2" v-if="hasInvalidMail">
                            <pure-error> <div v-text="$t('Invalid mail')"></div></pure-error>
                          </div>
                        </div>

                        <div class="mt3">
                          <pure-button @click="doRegister">Register</pure-button>
                        </div>
                      </div>
                    </pure-modal>
                  </div>
                </div>

                <div class="mv2 mw5 center pa3 white bg-blue tc"
                     v-show="succesfullySentForgotPasswordMessage"
                     v-text="$t('The email to reset your password has been sent')"></div>
                <div class="f7 pointer tc gray" @click="$refs.forgotPasswordModal.openModal()" v-text="$t('Forgot my password')"></div>
              </div>
              </div>
            </div>
        </div>
      </div>
      <auth-forgot-password-modal
        @sentForgotPasswordMail="displayForgotPasswordMessage"
        ref="forgotPasswordModal"></auth-forgot-password-modal>
      <stateful-newsletter-modal
        ref="newsletterModal"
        @signUp="succesfullySignedUpMessage = true"
      ></stateful-newsletter-modal>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { isAuthenticated, getUserId, hasInvalidUserCredentials } from '../../api/AuthApi'
  import { isValidMail } from '../../func/isValidMail'

  import FeedComponent from './sounds/TheFeedPage.vue'
  import StatefulSoundExploreCovers from '../stateful/sound/StatefulSoundExploreCovers'
  import AuthForgotPasswordModal from '../stateful/Auth/AuthForgotPasswordModal.vue'
  import StatefulNewsletterModal from '../stateful/Newsletter/NewsletterModal.vue'

  export default {
    components: {
      FeedComponent,
      StatefulSoundExploreCovers,
      AuthForgotPasswordModal,
      StatefulNewsletterModal,
    },
    metaInfo () {
      return {
        title: this.$t(this.userIsAuthenticated ? 'Home' : 'Login'),
      }
    },
    data () {
      return {
        username: '',
        password: '',
        email: '',
        errorType: '',
        isAuthenticated: null,
        hasInvalidMail: false,
        openRegisterModal: false,
        succesfullySignedUpMessage: false,
        succesfullySentForgotPasswordMessage: false,
      }
    },
    mounted () {
      isAuthenticated().then(d => {
        this.isAuthenticated = d
      })
    },
    methods: {
      authenticate () {
        this.errorType = ''
        this.isAuthenticated = true
        Vue.prototype.userIsAuthenticated = true
      },
      doLogin () {
        this.authLogIn(this.username, this.password)
          .then(() => {
            getUserId().then(id => {
              if (id) this.authenticate()
            })
          })
          .catch(() => {
            this.errorType = 'login'
          })
      },
      showLengthRequirementsError () {
        this.errorType = 'register because username and password dont meet length requirements'
      },
      startRegister () {
        if (hasInvalidUserCredentials(this.username, this.password)) {
          this.showLengthRequirementsError()
          return null
        }

        this.openRegisterModal = true
      },
      doRegister () {
        if (!isValidMail(this.email)) {
          this.hasInvalidMail = true
          return null
        }

        this.authCreateUser(this.username, this.email, this.password)
          .then(() => this.authenticate())
          .catch((e) => {
            this.openRegisterModal = false

            if (e.message.indexOf('length requirements') !== -1) {
              return this.showLengthRequirementsError()
            }

            this.errorType = 'register'
            alert(`Could not create user (${e.message})`)
          })
      },
      openNewsletterModal () {
        this.$refs.newsletterModal.openModal()
      },
      displayForgotPasswordMessage () {
        this.succesfullySentForgotPasswordMessage = true
      },
    },
  }
</script>
