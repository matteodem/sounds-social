import { userSearchIndex } from '../../../search/UserSearchIndex'

export const searchUser = userId => query => {
  if (!query) return []
  return userSearchIndex.search(query, { userId }).fetch()
}
