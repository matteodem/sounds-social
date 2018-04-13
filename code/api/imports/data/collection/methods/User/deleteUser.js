import { Meteor } from 'meteor/meteor'
import { deleteProfile } from '../Profile/deleteProfile'
import { deletePlaylistsForUser } from '../Playlist/deletePlaylistsForUser'
import { deleteSoundsForUser } from '../Sound/deleteSoundsForUser'
import { deleteAliasesForUser } from '../Alias/deleteAliasesForUser'
import { deleteFilesForUser } from '../File/deleteFilesForUser'

export const deleteUser = userId => {
  deleteProfile(userId)
  deletePlaylistsForUser(userId)
  deleteSoundsForUser(userId)
  deleteAliasesForUser(userId)
  deleteFilesForUser(userId)

  Meteor.users.remove({ _id: userId })
}
