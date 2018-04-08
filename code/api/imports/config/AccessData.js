const isDevelopment = process.env.NODE_ENV === 'development'

export const webUrl = isDevelopment
  ? {
    host: 'localhost',
    port: '8080',
    path: '/reset-password',
    protocol: 'http',
  }
  : { host: 'sounds-social-dev.surge.sh', port: '', protocol: 'https' }

export const apiUrlString = isDevelopment
  ? 'http://localhost:3000'
  : 'https://sounds-social-dev.eu.meteorapp.com/'
