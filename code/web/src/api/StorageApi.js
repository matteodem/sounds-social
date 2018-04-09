import { checkImageFileType, checkAudioFileType } from '../func/checkFileType'
import { apiEndpointUrl } from '../config/ApiEndpointUrl'

const uploadFile = (file, type) => {
  const data = new FormData()
  data.append('data', file)

  // use the file endpoint
  return fetch(
    `${apiEndpointUrl}/file-api/${type}?userLoginToken=${localStorage.getItem(
      'Meteor.loginToken'
    )}`,
    {
      method: 'POST',
      body: data
    }
  ).then(response => response.json())
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
