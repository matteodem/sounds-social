import { get } from 'lodash/fp'
import { fetchOneUserById } from '../User/fetchOneUserById'
import { fetchOneProfile } from './fetchOneProfile'

export const fetchDisplayName = userId => {
  const profile = fetchOneProfile(userId)

  return get('profileName')(profile) || fetchOneUserById(userId).username
}
