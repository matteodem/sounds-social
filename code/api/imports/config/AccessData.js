const isDevelopment = process.env.NODE_ENV === 'development'

export const webUrl = isDevelopment
  ? {
    host: 'localhost',
    port: '8080',
    path: '/reset-password',
    protocol: 'http',
  }
  : { host: 'sounds-social-dev.surge.sh', port: '', protocol: 'https' }

const optionalWebUrlPort = webUrl.port ? `:${webUrl.port}` : ''

export const webUrlString = `${webUrl.protocol}://${
  webUrl.host
}${optionalWebUrlPort}`

export const apiUrlString = isDevelopment
  ? 'http://localhost:3000'
  : 'https://sounds-social-dev.eu.meteorapp.com/'

export const convertAudioUrlString = isDevelopment
  ? 'http://localhost:49000'
  : 'https://convert-audio-jloyyetbkd.now.sh'
