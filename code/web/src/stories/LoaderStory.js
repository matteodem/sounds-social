import { storiesOf } from '@storybook/vue'

let intervalHandle

export const loaderStories = moduleArg =>
  storiesOf('Pure Loader', moduleArg)
    .add('loader block', () => ({
      template: '<pure-loader-block cssClasses="w-50 h3"></pure-loader-block>'
    }))
    .add('loader block with custom styles', () => ({
      template:
        '<pure-loader-block cssStyles="width: 100px; height: 100px; border-radius: 50px;"></pure-loader-block>'
    }))
    .add('loader text', () => ({
      template:
        '<pure-loader-text><pure-icon icon="play"></pure-icon> loading...</pure-loader-text>'
    }))
    .add('sound loader', () => ({
      template: '<pure-loader-sound></pure-loader-sound>'
    }))
    .add('sound loader, in detail view', () => ({
      template: '<pure-loader-sound :isDetail="true"></pure-loader-sound>'
    }))
    .add('sound loader list', () => ({
      template: '<pure-loader-sound-list></pure-loader-sound-list>'
    }))
    .add('loader transition (switching loading every 2 seconds)', () => ({
      template: `
<pure-loader-transition :is-loading="isLoading">
  <div slot="loader">
    <pure-loader-sound></pure-loader-sound>
  </div>
  <div slot="content">loaded!</div>
</pure-loader-transition>`,
      data () {
        return {
          isLoading: true
        }
      },
      mounted () {
        intervalHandle = setInterval(() => {
          this.isLoading = !this.isLoading
        }, 2000)
      },
      destroyed () {
        clearInterval(intervalHandle)
      }
    }))
