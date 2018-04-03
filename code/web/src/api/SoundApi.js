import gql from 'graphql-tag'
import { apolloClient } from './graphql/client'

export const DEFAULT_PAGINATED_SOUND_LIMIT = 6
export const DEFAULT_FEED_SOUND_LIMIT = 20

const listSoundFragment = gql`
  fragment ListSoundFields on Sound {
    _id
    name
    isPublic
    ownerType
    coverFile {
      url
    }
    description
    createdAt {
      fromNow
    }
    file {
      url
    }
    creator {
      _id
      type
      username
    }
  }
`

const listSoundWithPaginationFragment = gql`
  fragment ListSoundWithPagination on PaginatableSoundResult {
    items {
      ...ListSoundFields
    }
    paginationInfo {
      pagesCount
      currentPage
      hasMore
    }
  }

  ${listSoundFragment}
`

export const detailSoundQuery = gql`
  query DetailSound($id: String!) {
    getSound(_id: $id) {
      _id
      name
      description
      createdAt {
        fromNow
      }
      fileId
      isPublic
      file {
        url
      }
      isRemovable
      coverFile {
        url
      }
      creator {
        _id
        type
        username
      }
      playsCount
    }
  }
`

export const editSoundFormQuery = gql`
  query EditSoundForm($id: String!) {
    soundToEdit: getSound(_id: $id) {
      name
      description
      fileId
      isPublic
      creator {
        _id
        username
      }
    }
  }
`

export const updateSound = (id, data) =>
  apolloClient.mutate({
    mutation: gql`
      mutation EditSound($id: String!, $data: SoundInput!) {
        updateSound(_id: $id, data: $data) {
          _id
        }
      }
    `,
    variables: {
      id,
      data
    },
    fetchPolicy: 'network-only'
  })

export const removeSound = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation RemoveSound($id: String!) {
        deleteSound(_id: $id) {
          _id
        }
      }
    `,
    variables: { id },
    refetchQueries: ['DetailSound']
  })

export const publishSound = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation PublishSound($id: String!) {
        publishSound(soundId: $id) {
          _id
        }
      }
    `,
    variables: { id },
    refetchQueries: ['DetailSound']
  })

export const startPlayingSound = id =>
  apolloClient.mutate({
    mutation: gql`
      mutation StartPlayingSound($id: String!) {
        startPlayingSound(soundId: $id) {
          soundPlayingId
        }
      }
    `,
    variables: { id }
  })

export const countPlayingSound = (id, soundPlayingId) =>
  apolloClient.mutate({
    mutation: gql`
      mutation StartPlayingSound($id: String!, $soundPlayingId: String!) {
        countPlayingSound(soundPlayingId: $soundPlayingId, soundId: $id) {
          soundPlayingId
        }
      }
    `,
    variables: { id, soundPlayingId },
    refetchQueries: ['DetailSound']
  })

export const createSound = ({
  name,
  description,
  file,
  aliasId,
  creatorId,
  isPublic
}) =>
  apolloClient.mutate({
    mutation: gql`
      mutation CreateSound(
        $name: String!
        $aliasId: String
        $description: String
        $file: FileData!
        $creatorId: String!
        $isPublic: Boolean!
      ) {
        createSound(
          aliasId: $aliasId
          data: {
            name: $name
            creatorId: $creatorId
            file: $file
            isPublic: $isPublic
            description: $description
          }
        ) {
          _id
        }
      }
    `,
    variables: { name, description, file, aliasId, creatorId, isPublic }
  })

export const listSoundDefaultQuery = gql`
  query SoundListQuery($userId: String!, $loggedInFeed: String!) {
    listSound(
      filters: [
        { key: "user", value: $userId }, 
        { key: "loggedInFeed", value: $loggedInFeed }
      ]
      pagination: { limit: ${DEFAULT_FEED_SOUND_LIMIT} }
    ) {
      items {
        ...ListSoundFields
      }
      paginationInfo {
        hasMore
      }
    }
  }
  ${listSoundFragment}
`

export const exploreCoversQuery = gql`
  query SoundListQuery {
    exploreCovers: listSound(
      limit: 4
      filters: [
        { key: "user", value: "" }
        { key: "loggedInFeed", value: "false" }
      ]
    ) {
      items {
        _id
        coverFile {
          url
        }
      }
    }
  }
`

export const searchSoundQuery = gql`  
  query SearchSoundsQuery($query: String! $skip: Int!) {
    listSound: searchSound(
      query: $query
      pagination: { limit: ${DEFAULT_PAGINATED_SOUND_LIMIT} skip: $skip }
    ) {
      ...ListSoundWithPagination
    }
  }
  ${listSoundWithPaginationFragment}
`

export const playlistSoundsQuery = gql`  
  query PlaylistSoundsQuery($playlistId: String! $skip: Int!) {
    listSound: listSoundForPlaylist(
      playlistId: $playlistId
      pagination: { limit: ${DEFAULT_PAGINATED_SOUND_LIMIT} skip: $skip }
    ) {
      ...ListSoundWithPagination
    }
  }
  ${listSoundWithPaginationFragment}
`

export const aliasSoundsQuery = gql`
  query AliasSoundsQuery($aliasId: String! $skip: Int!) {
    listSound(
      filters: [{ key: "alias", value: $aliasId }]
      pagination: { limit: ${DEFAULT_PAGINATED_SOUND_LIMIT} skip: $skip }
    ) {
      ...ListSoundWithPagination
    }
  }
  ${listSoundWithPaginationFragment}
`

export const userProfileSoundsQuery = gql`
  query UserSoundsQuery($userId: String! $skip: Int!) {
    listSound(
      filters: [{ key: "user", value: $userId }]
      pagination: { limit: ${DEFAULT_PAGINATED_SOUND_LIMIT} skip: $skip }
    ) {
      ...ListSoundWithPagination
    }
  }
  ${listSoundWithPaginationFragment}
`
