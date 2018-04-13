import { apiEndpointUrl } from '../config/ApiEndpointUrl'
import { getUserToken } from '../config/getUserToken'

export const downloadUserExportData = () => {
  return window.open(`${apiEndpointUrl}/user-api/export/${getUserToken()}`)
}
