import moment from 'moment'
import { get, flow } from 'lodash/fp'
import { check, Match } from 'meteor/check'
import { Random } from 'meteor/random'
import { resolver, typeDef } from 'meteor/easy:graphqlizer'
import { soundCollection } from '../../data/collection/SoundCollection'
import { groupCollection } from '../../data/collection/GroupCollection'
import { soundSearchIndex } from '../../data/search/SoundSearchIndex'
import { checkUserIdRequired } from '../../lib/check/checkUserData'
import { fetchOneFileById } from '../../data/collection/fetch/File/fetchOneFileById'

let soundsBeingPlayed = []

export default {
  resolvers: {
    Query: {
      getSound (root, args, context) {
        const { _id } = args

        check(_id, Match.Maybe(String))

        return soundCollection.findOneForUser({ _id }, context.userId)
      },
      listSound (root, args, context) {
        const { filters } = args
        const { userId } = context

        check(filters, Match.Maybe(Array))

        const getValue = get('value')
        const compareKey = keyToCompare => ({ key }) => key === keyToCompare
        const userFilterId = getValue(filters.filter(compareKey('user'))[0])
        const groupFilterId = getValue(filters.filter(compareKey('group'))[0])
        const isFeed = 'true' === getValue(filters.filter(compareKey('loggedInFeed'))[0])

        if (userFilterId) return soundCollection.findForUser(userFilterId, userId).fetch()

        if (groupFilterId) return soundCollection.findForGroup(groupFilterId, userId).fetch()

        if (isFeed) return soundCollection.findForFeed(userId).fetch()

        return soundCollection.findForDiscover(userId).fetch()
      },
      searchSound: (root, args, context, ast) => {
        const { query } = args
        check(query, String)

        let { userId } = context

        if (!userId) userId = null

        return soundSearchIndex.search(query, { limit: 100, userId }).fetch()
      },
      listSoundForPlaylist: (root, args, context, ast) => {
        const { playlistId } = args
        check(playlistId, String)

        const { userId } = context

        return soundCollection.fetchForPlaylist(playlistId, userId)
      },
    },
    Mutation: {
      updateSound: (root, args) => {
        const { _id } = args
        const data = { ...args.data }

        check(_id, String)

        soundCollection.update({ _id }, { $set: data })

        return soundCollection.findOne({ _id })
      },
      deleteSound: resolver.delete(soundCollection),
      createSound: (root, args, context) => {
        const { userId } = context
        const { groupId } = args
        checkUserIdRequired(userId)
        check(groupId, Match.Maybe(String))

        return soundCollection.addSound(args.data, userId, groupId)
      },
      publishSound: (root, args, context) => {
        const { userId } = context
        const { soundId } = args

        checkUserIdRequired(userId)
        check(soundId, String)

        return soundCollection.publishSound(soundId, userId)
      },
      startPlayingSound: (root, args, context) => {
        const { userId } = context
        const { soundId } = args

        check(soundId, String)

        const soundPlayingId = Random.id()

        soundsBeingPlayed.push({
          soundPlayingId,
          soundId,
          userId,
          startedAt: new Date(),
        })

        return { soundPlayingId, soundId }
      },
      countPlayingSound: (root, args, context) => {
        const { userId } = context

        const { soundPlayingId, soundId } = args
        check(soundPlayingId, String)
        check(soundId, String)

        const shouldCountPlay = soundsBeingPlayed
          .filter(play => play.userId === userId)
          .every(play => {
            const sameIds = play.soundPlayingId === soundPlayingId && play.soundId === soundId
            const startedFiveSecondsAgo = moment
              .duration(moment(new Date()).diff(play.startedAt)).seconds() > 5

            return sameIds && startedFiveSecondsAgo
          })

        if (shouldCountPlay) soundCollection.countPlay(soundId)

        soundsBeingPlayed = soundsBeingPlayed.filter(play => play.userId !== userId)

        return { soundPlayingId, soundId }
      },
      addCoverFile: (root, args, context) => {
        const { soundId, fileData } = args
        check(soundId, String)
        check(fileData, {
          _id: String,
          secret: String,
          url: String,
        })

        return soundCollection.updateCover(soundId, context.userId, fileData)
      },
    },
    Sound: {
      file: flow(get('fileId'), fetchOneFileById),
      playsCount: root => root.playsCount || 0,
      coverFile: flow(get('coverFileId'), fetchOneFileById),
      creator: root => {
        if (!root.ownerType || root.ownerType === 'user') {
          return {
            ...Meteor.users.findOne({ _id: root.creatorId }),
            type: 'user',
          }
        }

        const group = groupCollection.findOneById(root.creatorId)

        if (group) return { ...group, username: group.name, type: 'group' }
      },
      isRemovable: (root, args, context) => {
        if (!root.ownerType || root.ownerType === 'user') {
          return root.creatorId === context.userId
        }

        return !!groupCollection.isMemberOfGroup(context.userId, root.creatorId)
      },
    },
  },
  typeDefs: [
    typeDef.get('Sound'),
    typeDef.update('Sound'),
    typeDef.delete('Sound'),
    `
    type Sound {
      _id: String!
      name: String!
      description: String
      createdAt: Date
      fileId: String!
      ownerType: String
      isPublic: Boolean!
      playsCount: Int
      file: File
      creator: Creator
      coverFile: File
      isRemovable: Boolean
    }
    
    input SoundInput {
      name: String!
      description: String
      isPublic: Boolean
      creatorId: String!
      file: FileData
    }
    
    # Represents a sound being played
    type SoundPlay {
      # Random id when sound is started playing
      soundPlayingId: String
      soundId: String
    }
    
    extend type Mutation {
      createSound(data: SoundInput! groupId: String): Sound
      publishSound(soundId: String!): Sound
      addCoverFile(soundId: String! fileData: FileData!): Sound
      startPlayingSound(soundId: String!): SoundPlay
      countPlayingSound(soundPlayingId: String! soundId: String!): SoundPlay
    }
    
    extend type Query {
      searchSound(query: String!): [Sound]
      listSoundForPlaylist(playlistId: String!): [Sound]
      listSound(limit: Int, offset: Int, filters: [FilterInput]): [Sound]
    }
    `,
  ],
}
