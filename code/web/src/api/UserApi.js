import { apiEndpointUrl } from '../config/ApiEndpointUrl'
import { getUserToken } from '../config/getUserToken'

export const downloadUserExportData = () => {
  return window.open(`${apiEndpointUrl}/user-api/export/${getUserToken()}`)
}

export const getUserPassphrase = () => {
  return fetch(`${apiEndpointUrl}/user-api/passphrase/${getUserToken()}`)
    .then(res => res.json())
    .then(({ passphrase }) => passphrase)
}

export const deleteUser = () => {
  return fetch(`${apiEndpointUrl}/user-api/delete/${getUserToken()}`, {
    method: 'POST'
  })
}
