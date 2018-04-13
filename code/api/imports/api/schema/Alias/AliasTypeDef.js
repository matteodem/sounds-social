export const AliasTypeDef = `
type Alias {
  _id: String!
  name: String
  # For example collective, label, duo etc.
  type: String
  description: String
  websiteUrl: String
  avatarFile: File
  members: [User]
  createdAt: Date
  isFollowedByCurrentUser: Boolean
  canFollow: Boolean
  isEditable: Boolean
  followerCount: Int
  playCount: Int
}

input AliasData {
  name: String!
  type: String
  description: String
  websiteUrl: String
  avatarFile: FileData
}

extend type Query {
  listAliasForUser(userId: String): [Alias]
  getAlias(_id: String!): Alias
}

extend type Mutation {
  createAlias(data: AliasData!): Alias
  updateAlias(_id: String! data: AliasData!): Alias
  removeAlias(_id: String!): Alias
  followAlias(toFollowId: String!): Alias
  unfollowAlias(toUnfollowId: String!): Alias
}
`
