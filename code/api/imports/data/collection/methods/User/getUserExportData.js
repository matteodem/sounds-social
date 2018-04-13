import { flow, map } from 'lodash/fp'
import { fetchOneUserById } from './fetchOneUserById'
import { fetchSoundsForCreator } from '../Sound/fetchSoundsForCreator'
import { fetchAliasesForUser } from '../Alias/fetchAliasesForUser'
import { fetchOneProfile } from '../Profile/fetchOneProfile'
import { fetchPlaylistsForUser } from '../Playlist/fetchPlaylistsForUser'
import { fetchFilesForUser } from '../File/fetchFilesForUser'
import { generateFileUrl } from '../../../../lib/File/generateFileUrl'
import { fetchOneFileById } from '../File/fetchOneFileById'

const mapFileUrl = map(data => {
  return {
    ...data,
    fileUrl: flow(fetchOneFileById, generateFileUrl)(data.fileId),
  }
})

export const getUserExportData = userId => {
  return {
    user: fetchOneUserById(userId),
    profile: fetchOneProfile(userId),
    playlists: fetchPlaylistsForUser(userId)(userId),
    sounds: flow(fetchSoundsForCreator, mapFileUrl)(userId),
    aliases: fetchAliasesForUser(userId)({}),
    files: fetchFilesForUser(userId),
  }
}
