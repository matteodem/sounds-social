import moment from 'moment'
import contentDisposition from 'content-disposition'
import { Restivus } from 'meteor/nimble:restivus'
import { webUrlString } from '../config/AccessData'
import { runAsyncWithUser } from './helpers/runAsyncWithUser'
import { getUserExportData } from '../data/collection/methods/User/getUserExportData'

const Api = new Restivus({
  prettyJson: true,
  apiPath: 'user-api/',
})

Api.addRoute('export/:token', {
  get() {
    const { result, error } = runAsyncWithUser({
      userToken: this.urlParams.token,
      onUser: ({ user, done }) => {
        done(null, getUserExportData(user._id))
      },
    })

    if (error) return { error }

    this.response.setHeader('Access-Control-Allow-Origin', webUrlString)
    this.response.setHeader(
      'Content-Disposition',
      contentDisposition(
        `user_export_${moment().format('YYYY_MM_DD_HH_mm_ss')}.json`
      )
    )
    this.response.write(JSON.stringify(result, null, 2))
    this.done()
  },
})
