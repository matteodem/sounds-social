import { gunzip } from 'zlib'
import { Restivus } from 'meteor/nimble:restivus'
import { Async } from 'meteor/meteorhacks:async'
import { ipfsFileStorage } from '../data/ipfs/IPFSFileStorage'
import { createUserPassphraseIfNeeded } from '../data/collection/methods/User/createUserPassphraseIfNeeded'
import { fetchOneUserById } from '../data/collection/methods/User/fetchOneUserById'
import { webUrlString } from '../config/AccessData'
import { resolvePromiseForCallback } from '../lib/resolvePromiseForCallback'
import { parseAndUploadFiles } from './FileApi/parseAndUploadFiles'
import { runAsyncWithUser } from './helpers/runAsyncWithUser'

const Api = new Restivus({
  prettyJson: true,
  apiPath: 'file-api/',
})

const hasInvalidArgs = ({ username, type }) => {
  return (
    username.includes('/') ||
    type.includes('/') ||
    !['sound', 'image'].includes(type)
  )
}

Api.addRoute(':type', {
  post() {
    const { type } = this.urlParams

    return runAsyncWithUser({
      userToken: this.queryParams.userLoginToken,
      onUser: ({ user, done }) => {
        const { username } = user

        if (hasInvalidArgs({ username, type })) {
          return done('Invalid data')
        }

        createUserPassphraseIfNeeded(user._id)

        const { passphrase } = fetchOneUserById(user._id)
        const { request } = this

        parseAndUploadFiles({
          request,
          username,
          type,
          passphrase,
          done,
          user,
        })
      },
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
