import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

const eventHandlers = `
@changeTitle="actionCall('changing title', arguments[0])"
@changeDescription="actionCall('changing description', arguments[0])"
@changeUploader="actionCall('changed uploader', arguments[0])"
@publish="actionCall('publish')"
@uploadFile="actionCall('uploaded file')"
`

export const soundFormBoxStories = moduleArg =>
  storiesOf('Pure Sound Form Box', moduleArg)
    .add('no file', () => ({
      template: `
<sound-form-box
  username=""
  :hasFile="false"
  :isUploading="false"
  name=""
></sound-form-box>`
    }))
    .add('with file', () => ({
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      },
      data () {
        return {
          aliases: [
            { _id: 'test1', name: 'Alias 1' },
            { _id: 'test2', name: 'Alias 2' }
          ]
        }
      },
      template: `
<sound-form-box
  username="Hans Peter"
  :aliases="aliases"
  :hasFile="true"
  :isUploading="false"
  name=""
  ${eventHandlers}
></sound-form-box>`
    }))
    .add('with data', () => ({
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      },
      template: `
<sound-form-box
  username="Hans Peter"
  :hasFile="true"
  :isUploading="false"
  name="My next track"
  description="Awesome description"
  ${eventHandlers}
></sound-form-box>`
    }))
    .add('additional buttons', () => ({
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      },
      template: `
<sound-form-box
  username="Hans Peter"
  :hasFile="true"
  :isUploading="false"
  name="My next track"
  description="Awesome description"
  ${eventHandlers}
>
<div class="dib ml1" slot="additionalButtons">
  <pure-button color="gray">Custom action</pure-button>
</div>
</sound-form-box>`
    }))
