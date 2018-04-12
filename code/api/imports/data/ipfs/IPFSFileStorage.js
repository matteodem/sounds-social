import crypto from 'crypto'
import IPFS from 'ipfs'

const defaultAlgorithm = 'aes-256-cbc'

let node

export const getNode = async () => {
  if (node) return node

  node = new IPFS()

  await new Promise(resolve => node.on('ready', resolve))

  return getNode()
}

const updateWithCipher = cipherMethod => (buffer, passphrase) => {
  const cipher = cipherMethod(defaultAlgorithm, passphrase)

  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

export const ipfsFileStorage = {
  crypto: {
    encrypt: updateWithCipher(crypto.createCipher),
    decrypt: updateWithCipher(crypto.createDecipher),
  },
  store: async ({ content, path, passphrase }) => {
    const node = await getNode()

    const buffer = ipfsFileStorage.crypto.encrypt(content, passphrase)

    return new Promise(resolve =>
      node.files.add({ content: buffer, path }, (err, data) => {
        if (!err) resolve(data)
      })
    )
  },
  find: async (hash, passphrase) => {
    const node = await getNode()

    const content = await new Promise((resolve, reject) => {
      node.files.cat(hash, (err, file) => {
        if (err) reject(err)
        else resolve(file)
      })
    })

    return ipfsFileStorage.crypto.decrypt(content, passphrase)
  },
}
