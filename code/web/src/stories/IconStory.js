import { storiesOf } from '@storybook/vue'

export const iconStories = moduleArg =>
  storiesOf('Pure Icon', moduleArg)
    .add('rocket icon', () => ({
      template: '<pure-icon icon="rocket"></pure-icon>'
    }))
    .add('trash icon', () => ({
      template: '<pure-icon icon="trash"></pure-icon>'
    }))
