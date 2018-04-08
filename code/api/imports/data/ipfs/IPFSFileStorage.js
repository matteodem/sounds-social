import crypto from 'crypto'
import IPFS from 'ipfs'

const defaultAlgorithm = 'aes-256-cbc'

let node

export const getNode = async () => {
  if (node) return node

  node = new IPFS()

  await new Promise(resolve => node.on('ready', resolve))

  return await getNode()
}

export const ipfsFileStorage = {
  crypto: {
    encrypt(buffer, passphrase) {
      const cipher = crypto.createCipher(defaultAlgorithm, passphrase)

      return Buffer.concat([cipher.update(buffer), cipher.final()])
    },
    decrypt(buffer, passphrase) {
      const decipher = crypto.createDecipher(defaultAlgorithm, passphrase)

      return Buffer.concat([decipher.update(buffer), decipher.final()])
    },
  },
  store: async ({ content, path, passphrase }) => {
    const node = await getNode()

    const buffer = ipfsFileStorage.crypto.encrypt(content, passphrase)

    return await new Promise(resolve =>
      node.files.add({ content: buffer, path }, (err, data) => resolve(data))
    )
  },
  find: async (hash, passphrase) => {
    const node = await getNode()

    const content = await new Promise(resolve =>
      node.files.cat(hash, (err, file) => resolve(file))
    )

    return ipfsFileStorage.crypto.decrypt(content, passphrase)
  },
}
