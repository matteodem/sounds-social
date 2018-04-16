import { map } from 'lodash/fp'
import gql from 'graphql-tag'
import { apiEndpointUrl } from '../config/ApiEndpointUrl'
import { getUserToken } from '../config/getUserToken'
import { apolloClient } from './graphql/client'

export const searchUserSelectOptions = query =>
  apolloClient
    .query({
      query: gql`
        query SearchUser($query: String!) {
          searchedUserOptions: searchUser(query: $query) {
            value: _id
            displayName
            username
          }
        }
      `,
      variables: { query }
    })
    .then(({ data: { searchedUserOptions } }) => {
      return map(({ value, displayName, username }) => ({
        value,
        label: `${displayName} (${username})`
      }))(searchedUserOptions)
    })

export const downloadUserExportData = () => {
  return window.open(`${apiEndpointUrl}/user-api/export/${getUserToken()}`)
}

export const getUserPassphrase = () => {
  return fetch(`${apiEndpointUrl}/user-api/passphrase/${getUserToken()}`)
    .then(res => res.json())
    .then(({ passphrase }) => passphrase)
}

export const deleteUser = () => {
  return fetch(`${apiEndpointUrl}/user-api/delete/${getUserToken()}`, {
    method: 'POST'
  })
}
