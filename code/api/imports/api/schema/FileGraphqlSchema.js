import { generateFileUrl } from '../../lib/File/generateFileUrl'

const typeDef = `
input FileData {
  _id: String!
  userId: String!
  hash: String!
}

type File {
  _id: String!
  userId: String!
  hash: String!
  url: String!
}
`

export default {
  typeDefs: [typeDef],
  resolvers: {
    File: {
      url: generateFileUrl,
    },
  },
}
