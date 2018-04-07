import { checkImageFileType, checkAudioFileType } from '../func/checkFileType'
import { apiEndpointUrl } from '../config/ApiEndpointUrl'

const uploadFile = (file, type) => {
  const data = new FormData()
  data.append('data', file)

  // use the file endpoint
  return fetch(`${apiEndpointUrl}/file-api/${type}`, {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(({ id: _id, secret, url }) => ({ _id, secret, url }))
}

const uploadImageFile = async file => {
  checkImageFileType(file)
  return uploadFile(file, 'image')
}

export const addProfileAvatarFile = uploadImageFile

export const addAliasAvatarFile = uploadImageFile

export const addCoverFile = uploadImageFile

export const addMusicFile = async file => {
  checkAudioFileType(file)
  return uploadFile(file, 'sound')
}
