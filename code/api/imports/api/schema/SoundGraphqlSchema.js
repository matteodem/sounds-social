import { flow, get } from 'lodash/fp'
import { check, Match } from 'meteor/check'
import { resolver, typeDef } from 'meteor/easy:graphqlizer'
import { addPaginationTypeDef } from '../helpers/PaginationMethods'
import { soundCollection } from '../../data/collection/SoundCollection'
import { checkUserIdRequired } from '../../lib/check/checkUserData'
import { fetchOneFileById } from '../../data/collection/methods/File/fetchOneFileById'
import { isMemberOfAlias } from '../../data/collection/methods/Alias/isMemberOfAlias'
import { fetchOneAliasById } from '../../data/collection/methods/Alias/fetchOneAliasById'
import { fetchOneUserById } from '../../data/collection/methods/User/fetchOneUserById'
import { createSound } from '../../data/collection/methods/Sound/createSound'
import { publishSound } from '../../data/collection/methods/Sound/publishSound'
import { updateSound } from '../../data/collection/methods/Sound/updateSound'
import { SoundTypeDef } from './Sound/SoundTypeDef'
import { listSoundResolver as listSound } from './Sound/listSoundResolver'
import { searchSoundResolver as searchSound } from './Sound/searchSoundResolver'
import { listSoundForPlaylistResolver as listSoundForPlaylist } from './Sound/listSoundForPlaylistResolver'
import { getSoundResolver as getSound } from './Sound/getSoundResolver'
import { startPlayingSoundResolver } from './Sound/startPlayingSoundResolver'
import { countPlayingSoundResolver } from './Sound/countPlayingSoundResolver'
import { addSoundCoverFileResolver } from './Sound/addSoundCoverFileResolver'

export const SOUND_DEFAULT_LIMIT = 10

let soundsBeingPlayed = []

export default {
  resolvers: {
    Query: { getSound, listSound, searchSound, listSoundForPlaylist },
    Mutation: {
      updateSound: (root, args, context) => {
        const { _id } = args
        const data = { ...args.data }
        const { userId } = context

        checkUserIdRequired(userId)
        check(_id, String)

        return updateSound(userId)(_id)(data)
      },
      deleteSound: resolver.delete(soundCollection),
      createSound: (root, args, context) => {
        const { userId } = context
        const { aliasId } = args
        checkUserIdRequired(userId)
        check(aliasId, Match.Maybe(String))

        return createSound(userId)(args.data)(aliasId)
      },
      publishSound: (root, args, context) => {
        const { userId } = context
        const { soundId } = args

        checkUserIdRequired(userId)
        check(soundId, String)

        return publishSound(userId)(soundId)
      },
      startPlayingSound: startPlayingSoundResolver(soundsBeingPlayed),
      countPlayingSound: countPlayingSoundResolver(soundsBeingPlayed),
      addCoverFile: addSoundCoverFileResolver,
    },
    Sound: {
      file: flow(get('fileId'), fetchOneFileById),
      playsCount: root => root.playsCount || 0,
      coverFile: flow(get('coverFileId'), fetchOneFileById),
      creator: root => {
        if (!root.ownerType || root.ownerType === 'user') {
          return {
            ...fetchOneUserById(root.creatorId),
            type: 'user',
          }
        }

        const alias = fetchOneAliasById(root.creatorId)

        if (alias) return { ...alias, username: alias.name, type: 'alias' }
      },
      isRemovable: (root, args, context) => {
        if (!root.ownerType || root.ownerType === 'user') {
          return root.creatorId === context.userId
        }

        return isMemberOfAlias(context.userId, root.creatorId)
      },
    },
  },
  typeDefs: [
    typeDef.get('Sound'),
    typeDef.update('Sound'),
    typeDef.delete('Sound'),
    addPaginationTypeDef('Sound'),
    SoundTypeDef,
  ],
}
