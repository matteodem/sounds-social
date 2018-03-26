export const SoundTypeDef = `
type Sound {
  _id: String!
  name: String!
  description: String
  createdAt: Date
  fileId: String!
  ownerType: String
  isPublic: Boolean!
  playsCount: Int
  file: File
  creator: Creator
  coverFile: File
  isRemovable: Boolean
}

input SoundInput {
  name: String!
  description: String
  isPublic: Boolean
  creatorId: String!
  file: FileData
}

# Represents a sound being played
type SoundPlay {
  # Random id when sound is started playing
  soundPlayingId: String
  soundId: String
}

extend type Mutation {
  createSound(data: SoundInput! aliasId: String): Sound
  publishSound(soundId: String!): Sound
  addCoverFile(soundId: String! fileData: FileData!): Sound
  startPlayingSound(soundId: String!): SoundPlay
  countPlayingSound(soundPlayingId: String! soundId: String!): SoundPlay
}

extend type Query {
  searchSound(
    query: String!
    pagination: PaginationInput
  ): PaginatableSoundResult
  listSoundForPlaylist(
    playlistId: String!
    pagination: PaginationInput
  ): PaginatableSoundResult
  listSound(
    limit: Int
    offset: Int 
    filters: [FilterInput] 
    pagination: PaginationInput
  ): PaginatableSoundResult
}
`
