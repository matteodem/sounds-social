import fs from 'fs'
import request from 'request'
import { Random } from 'meteor/random'
import { convertAudioUrlString } from '../../config/AccessData'

export const optimizeAudioFile = path =>
  new Promise((resolve, reject) => {
    const req = request.post(`${convertAudioUrlString}/api/convert`)

    const form = req.form()

    form.append('file', fs.createReadStream(path))

    const mp3Path = `/tmp/${Random.id()}.mp3`

    const writeStream = fs.createWriteStream(mp3Path)

    req.pipe(writeStream)

    req.on('error', err => reject(err))

    req.on('response', function() {
      writeStream.on('finish', function() {
        fs.readFile(mp3Path, function(err, data) {
          if (err) reject(err)
          resolve(data)

          fs.unlink(mp3Path, function(err) {
            if (err) console.log(`had error on deleting file: ${err.message}`)
          })
        })
      })
    })
  })
