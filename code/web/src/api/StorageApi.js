import { checkImageFileType, checkAudioFileType } from '../func/checkFileType'

const uploadFile = file => {
  const data = new FormData()
  data.append('data', file)

  // use the file endpoint
  return fetch('https://api.graph.cool/file/v1/cj9g4oifs7cct0120dy1w6j0p', {
    method: 'POST',
    body: data
  })
    .then(response => {
      return response.json()
    })
    .then(({ id: _id, secret, url }) => ({ _id, secret, url }))
}

const uploadImageFile = async file => {
  checkImageFileType(file)
  return uploadFile(file)
}

export const addProfileAvatarFile = uploadImageFile

export const addAliasAvatarFile = uploadImageFile

export const addCoverFile = uploadImageFile

export const addMusicFile = async file => {
  checkAudioFileType(file)
  return uploadFile(file)
}
