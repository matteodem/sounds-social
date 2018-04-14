import { userSearchIndex } from '../../../search/UserSearchIndex'

export const searchUser = userId => query => {
  console.log(query, userId)
  return userSearchIndex.search(query, { userId }).fetch()
}
