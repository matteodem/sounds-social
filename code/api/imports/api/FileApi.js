import fs from 'fs'
import { gzip, gunzip } from 'zlib'
import { Random } from 'meteor/random'
import { Restivus } from 'meteor/nimble:restivus'
import { Async } from 'meteor/meteorhacks:async'
import { getUserForContext } from 'meteor/apollo'
import { ipfsFileStorage } from '../data/ipfs/IPFSFileStorage'
import { createUserPassphraseIfNeeded } from '../data/collection/methods/User/createUserPassphraseIfNeeded'
import { fetchOneUserById } from '../data/collection/methods/User/fetchOneUserById'
import { webUrlString } from '../config/AccessData'
import { resolvePromiseForCallback } from '../lib/resolvePromiseForCallback'

const formidable = require('formidable')

const Api = new Restivus({
  prettyJson: true,
  apiPath: 'file-api/',
})

const getRequiredUser = async ({ queryParams: { userLoginToken } }) => {
  if (!userLoginToken) return false

  const { user } = await getUserForContext(userLoginToken)

  if (Object.keys(user).length === 0) return false

  return user
}

const parseAndUploadFiles = ({
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

Api.addRoute(':type', {
  post() {
    const { type } = this.urlParams

    return Async.runSync(done => {
      const form = new formidable.IncomingForm()

      getRequiredUser(this).then(user => {
        if (!user) return done('No user found')

        const { username } = user

        if (username.includes('/')) return done('Invalid username')

        createUserPassphraseIfNeeded(user._id)

        const { passphrase } = fetchOneUserById(user._id)
        const { request } = this

        parseAndUploadFiles({
          request,
          form,
          username,
          type,
          passphrase,
          done,
          user,
        })
      })
    })
  },
})

Api.addRoute('retrieve/:userId/:hash', {
  get() {
    const user = fetchOneUserById(this.urlParams.userId)

    const content = Async.runSync(done => {
      if (!user) return done('File not found')

      ipfsFileStorage
        .find(this.urlParams.hash, user.passphrase)
        .then(zippedContent => {
          return new Promise((resolve, reject) => {
            gunzip(zippedContent, resolvePromiseForCallback(resolve, reject))
          })
        })
        .then(content => done(null, content))
        .catch(e => done(`could not decrypt: ${e.message}`))
    })

    if (content.result) {
      this.response.setHeader('Access-Control-Allow-Origin', webUrlString)
      this.response.write(content.result)
      this.done()
    }

    return content
  },
})
