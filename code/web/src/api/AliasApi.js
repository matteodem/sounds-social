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
    isInvitedToJoin
    avatarFile {
      url
    }
    members {
      _id
      username
      displayName
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
  description = '',
  memberIds,
  invitedMemberIds
) => {
  const action = id ? 'update' : 'create'

  return apolloClient.mutate({
    mutation: gql`
      mutation ${startCase(action)}Alias(
          ${id ? '$id: String!' : ''}
          $data: AliasData!
      ) {
        alias: ${action}Alias(${id ? '_id: $id' : ''} data: $data) {
          _id
        }
      }
    `,
    variables: {
      id,
      data: {
        name,
        type,
        websiteUrl,
        avatarFile,
        description,
        memberIds,
        invitedMemberIds
      }
    }
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

export const acceptInvitation = aliasId =>
  apolloClient.mutate({
    mutation: gql`
      mutation AcceptInvitationMutation($aliasId: String!) {
        acceptInvitation(_id: $aliasId) {
          _id
        }
      }
    `,
    variables: { aliasId },
    refetchQueries: ['AliasPage']
  })

export const denyInvitation = aliasId =>
  apolloClient.mutate({
    mutation: gql`
      mutation DenyInvitationMutation($aliasId: String!) {
        denyInvitation(_id: $aliasId) {
          _id
        }
      }
    `,
    variables: { aliasId },
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
      members {
        _id
        displayName
        username
      }
      invitedMembers {
        _id
        displayName
        username
      }
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
