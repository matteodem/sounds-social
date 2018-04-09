import fs from 'fs'
import { gzip } from 'zlib'
import { Random } from 'meteor/random'
import { ipfsFileStorage } from '../../data/ipfs/IPFSFileStorage'
import { resolvePromiseForCallback } from '../../lib/resolvePromiseForCallback'

export const parseAndUploadFiles = ({
  request,
  form,
  username,
  type,
  passphrase,
  done,
  user,
}) => {
  form.parse(request, (err, fields, files) => {
    if (err) throw new Error(err.message)

    fs.readFile(files.data.path, (err, data) => {
      if (err) throw new Error(err.message)

      const promise = new Promise((resolve, reject) => {
        gzip(data, resolvePromiseForCallback(resolve, reject))
      })

      promise.then(zippedContent => {
        ipfsFileStorage
          .store({
            passphrase,
            content: zippedContent,
            path: `/${username}/${type}/${Random.id()}`,
          })
          .then(files => {
            const lastFile = files[files.length - 1]

            done(null, {
              _id: Random.id(),
              userId: user._id,
              hash: lastFile.hash,
            })
          })
          .catch(e => done(e.message))
      })
    })
  })
}
