import { apiUrlString } from '../../config/AccessData'

export const generateFileUrl = ({ userId, hash }) =>
  `${apiUrlString}/file-api/retrieve/${userId}/${hash}`
