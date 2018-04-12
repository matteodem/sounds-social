import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

export const modalStories = moduleArg =>
  storiesOf('Pure Modal', moduleArg).add('with text and emoji', () => ({
    methods: { close: action('close!') },
    template: `
<pure-modal @close="close">
  <div class="pa3">Do you really want to delete this? ♻</div>
</pure-modal>`
  }))
