import fs from 'fs'
import { gzip } from 'zlib'
import { Random } from 'meteor/random'
import { ipfsFileStorage } from '../../data/ipfs/IPFSFileStorage'
import { resolvePromiseForCallback } from '../../lib/resolvePromiseForCallback'
import { optimizeAudioFile } from './optimizeAudioFile'

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

    const filePath = files.data.path

    fs.readFile(filePath, (err, data) => {
      if (err) throw new Error(err.message)

      const zipData = dataToZip =>
        new Promise((resolve, reject) => {
          gzip(dataToZip, resolvePromiseForCallback(resolve, reject))
        })

      const optimizeOrNoOp =
        type === 'sound' ? optimizeAudioFile(filePath) : Promise.resolve(data)

      optimizeOrNoOp
        .then(optimizedData => zipData(optimizedData))
        .then(zippedContent => {
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
