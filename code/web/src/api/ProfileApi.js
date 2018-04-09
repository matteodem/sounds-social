import gql from 'graphql-tag'
import { apolloClient } from './graphql/client'

export const ProfileBoxFieldsFragment = gql`
  fragment ProfileBoxFields on User {
    _id
    username
    isFollowedByCurrentUser
    canFollow
    displayName
    profile {
      description
      websiteUrl
      avatarFile {
        url
      }
      type
    }
    followerCount
    playCount
    aliases {
      _id
      name
      avatarFile {
        url
      }
    }
  }
`

export const updateProfile = profileData =>
  apolloClient.mutate({
    mutation: gql`
      mutation ProfileUpdateMutation($profileData: ProfileData!) {
        updateUserProfile(profileData: $profileData) {
          description
          language
        }
      }
    `,
    variables: { profileData },
    fetchPolicy: 'network-only'
  })

export const follow = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation FollowMutation($id: String!) {
        followUser(toFollowId: $id) {
          _id
        }
      }
    `,
    variables: { id },
    refetchQueries: ['ProfilePage', 'SoundListQuery']
  })

export const unfollow = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation UnfollowMutation($id: String!) {
        unfollowUser(toUnfollowId: $id) {
          _id
        }
      }
    `,
    variables: { id },
    refetchQueries: ['ProfilePage', 'SoundListQuery']
  })

export const profilePageQuery = gql`
  query ProfilePage($id: String!) {
    getUser(_id: $id) {
      ...ProfileBoxFields
    }
  }
  ${ProfileBoxFieldsFragment}
`
