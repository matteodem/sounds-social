import { get } from 'lodash/fp'
import { fetchAliasesForUser } from './fetchAliasesForUser'

export const fetchAliasIdsForUser = userId =>
  fetchAliasesForUser(userId)({ _id: 1 }).map(get('_id'))
