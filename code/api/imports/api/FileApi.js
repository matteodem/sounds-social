import fs from 'fs'
import { Random } from 'meteor/random'
import { Restivus } from 'meteor/nimble:restivus'
import { Async } from 'meteor/meteorhacks:async'
import { ipfsFileStorage } from '../data/ipfs/IPFSFileStorage'

const formidable = require('formidable')

const Api = new Restivus({
  prettyJson: true,
  apiPath: 'file-api/',
})

const checkAuth = ({ queryParams }) => {}

Api.addRoute(':type', {
  post() {
    checkAuth(this)

    // userId needed
    const { type } = this.urlParams

    return Async.runSync(done => {
      const form = new formidable.IncomingForm()

      form.parse(this.request, function(err, fields, files) {
        fs.readFile(files.data.path, (err, data) => {
          if (err) throw new Error(err.message)
          ipfsFileStorage
            .store({
              content: data,
              path: `/username_${type}_${Random.id()}`,
              passphrase: 'try to figure me out',
            })
            .then(files => done(null, files))
            .catch(e => done(e.message))
        })
      })
    })
  },
})

Api.addRoute('retrieve/:hash', {
  get() {
    checkAuth(this)

    const content = Async.runSync(done => {
      ipfsFileStorage
        .find(this.urlParams.hash, 'try to figure me out')
        .then(content => done(null, content))
        .catch(e => done(`could not decrypt: ${e.message}`))
    })

    if (content.result) {
      this.response.write(content.result)
      this.done()
    }

    return content
  },
})
