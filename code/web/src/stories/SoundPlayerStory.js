import { sample, uniqueId } from 'lodash/fp'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { createSound } from '../func/mappers/mapSound'

import store from '../store'

import StatefulSoundPlayer from '../components/stateful/sound/StatefulSoundPlayer.vue'

const createTestSound = (id, title, by) =>
  createSound(
    id,
    title,
    by,
    `${id}AuthorId`,
    'https://pre00.deviantart.net/a157/th/pre/i/2016/350/e/5/joji_music__fake_album_cover__by_leavesitw-daru5ty.jpg',
    'https://www.dropbox.com/s/25xspuhs86x7290/till_the_end_short_snippet.wav?raw=1'
  )

const soundList = [
  createTestSound('XFff1', 'My song', 'David Guetta'),
  createTestSound('XFff2', 'My second song', 'Babedi Bupedi'),
  createTestSound('XFff3', 'Third.5 song', 'Matt Music Maker 2'),
  createTestSound('XFff33', 'Third song', 'Matt Music Maker')
]

const eventTemplateHandlers = `
@openSound="actionCall('openSound', arguments[0])"
@openProfile="actionCall('openProfile', arguments[0])"
@playSound="actionCall('playSound', arguments[0])"
@removeSound="actionCall('removeSound', arguments[0])"
@moveSound="actionCall('moveSound', arguments)"

@openList="actionCall('openList')"
@closeList="actionCall('closeList')"

@play="actionCall('play')"
@pause="actionCall('pause')"
@stepForward="actionCall('stepForward')"
@stepBackward="actionCall('stepBackward')"

@randomize="actionCall('randomize', arguments[0])"
@loop="actionCall('loop', arguments[0])"
@loopSingle="actionCall('loopSingle', arguments[0])"

@mute="actionCall('mute')"
@unmute="actionCall('unmute')"

@loadMoreSounds="actionCall('loadMoreSounds')"
`

export const soundPlayerStories = moduleArg => {
  storiesOf('Pure Sound Player', moduleArg)
    .add('empty soundlist', () => ({
      template: '<sound-player :sounds="sounds"></sound-player>',
      data () {
        return {
          sounds: []
        }
      }
    }))
    .add('closed playing second', () => ({
      template: `<sound-player :isPlaying="true" current="XFff2" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return {
          sounds: soundList
        }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('open paused second', () => ({
      template: `<sound-player :listVisible="true" :isPlaying="false" current="XFff2" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return {
          sounds: soundList
        }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('playing first', () => ({
      template: `<sound-player :listVisible="true" :isPlaying="true" current="XFff1" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('playing last', () => ({
      template: `<sound-player :listVisible="true" :isPlaying="true" current="XFff33" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('muted playing last', () => ({
      template: `<sound-player :listVisible="true" :isPlaying="true" :isMuted="true" current="XFff33" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('playing in randomized mode', () => ({
      template: `<sound-player :listVisible="true" :isPlaying="true" mode="random" current="XFff33" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('playing in loop mode', () => ({
      template: `<sound-player :listVisible="true" :isPlaying="true" mode="loop" current="XFff33" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('playing in loop single mode', () => ({
      template: `<sound-player :listVisible="true" :isPlaying="true" mode="loop-single" current="XFff33" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('2 hours playing with 1/3 progress', () => ({
      template: `<sound-player :isPlaying="true" mode="loop-single" playingTime="02:00:00" 
:timeLineProgress="1 / 3"  current="XFff33" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('2 minutes 30 seconds playing with 4/5 progress', () => ({
      template: `<sound-player :isPlaying="true" mode="loop-single" playingTime="00:02:30" 
:timeLineProgress="4 / 5"  current="XFff33" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return { sounds: soundList }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('a lot of sounds with more to load', () => ({
      template: `<sound-player :listVisible="true" :hasMoreSounds="true" :isPlaying="true" current="XFff2" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return {
          sounds: [
            ...soundList,
            ...soundList,
            ...soundList,
            ...soundList,
            ...soundList
          ]
        }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))
    .add('a lot of sounds without more to load', () => ({
      template: `<sound-player :listVisible="true" :hasMoreSounds="false" :isPlaying="true" current="XFff2" :sounds="sounds" ${eventTemplateHandlers}></sound-player>`,
      data () {
        return {
          sounds: [
            ...soundList,
            ...soundList,
            ...soundList,
            ...soundList,
            ...soundList
          ]
        }
      },
      methods: {
        actionCall (type, args) {
          action(type)(args)
        }
      }
    }))

  storiesOf('Stateful Sound Player', moduleArg).add('with state', () => ({
    store,
    template: `
<div>
  <stateful-sound-player></stateful-sound-player>
  
  <div class="mt5">
    <pure-button @click="addSound">Add sound to soundlist</pure-button>
  </div>
</div>
      `,
    components: { StatefulSoundPlayer },
    methods: {
      addSound () {
        const id = uniqueId()

        this.$store.dispatch('addSoundToPlayer', {
          sound: createTestSound(
            id,
            `${sample([
              'My first song',
              'Club Banger',
              'Run the trap'
            ])} #${id}`,
            `${sample([
              'Franz Weber',
              'Hans Peter',
              'David Guerilla',
              'Dub Break'
            ])} #${id}`
          )
        })
      }
    }
  }))
}
