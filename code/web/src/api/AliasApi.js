import { startCase } from 'lodash/fp'
import gql from 'graphql-tag'
import { apolloClient } from './graphql/client'

export const AliasDetailedFieldsFragment = gql`
  fragment AliasDetailedFields on Alias {
    _id
    name
    type
    description
    isFollowedByCurrentUser
    canFollow
    isEditable
    websiteUrl
    followerCount
    playCount
    avatarFile {
      url
    }
    members {
      _id
      username
      profile {
        avatarFile {
          url
        }
      }
    }
  }
`

export const saveAlias = (
  id,
  name,
  type,
  websiteUrl,
  avatarFile,
  description = ''
) => {
  const action = id ? 'update' : 'create'

  return apolloClient.mutate({
    mutation: gql`
      mutation ${startCase(action)}Alias(
          ${id ? '$id: String!' : ''}
          $name: String! 
          $type: String! 
          $websiteUrl: String 
          $avatarFile: FileData 
          $description: String
      ) {
        alias: ${action}Alias(${
      id ? '_id: $id' : ''
    } data: { name: $name type: $type websiteUrl: $websiteUrl avatarFile: $avatarFile description: $description }) {
          _id
        }
      }
    `,
    variables: { id, name, type, websiteUrl, avatarFile, description }
  })
}

export const removeAlias = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation RemoveAlias($id: String!) {
        alias: removeAlias(_id: $id) {
          _id
        }
      }
    `,
    variables: { id }
  })

export const follow = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation FollowAliasMutation($id: String!) {
        followAlias(toFollowId: $id) {
          _id
        }
      }
    `,
    variables: { id },
    refetchQueries: ['AliasPage']
  })

export const unfollow = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation UnfollowAliasMutation($id: String!) {
        unfollowAlias(toUnfollowId: $id) {
          _id
        }
      }
    `,
    variables: { id },
    refetchQueries: ['AliasPage']
  })

export const aliasPageQuery = gql`
  query AliasPage($id: String!) {
    singleAlias: getAlias(_id: $id) {
      ...AliasDetailedFields
    }
  }
  ${AliasDetailedFieldsFragment}
`

export const aliasFormDataQuery = gql`
  query AliasFormData($id: String!) {
    aliasFormData: getAlias(_id: $id) {
      name
      type
      description
      websiteUrl
    }
  }
`

export const aliasOptionDataQuery = gql`
  query AliasOptionData {
    aliasOptionData: listAliasForUser {
      _id
      name
    }
  }
`
