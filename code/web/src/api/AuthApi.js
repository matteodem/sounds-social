import gql from 'graphql-tag'
import { get, isUndefined } from 'lodash/fp'
import {
  logout,
  loginWithPassword,
  createUser as apolloCreateUser,
  userId,
  forgotPassword,
  resetPassword as apolloResetPassword
} from 'meteor-apollo-accounts'
import { apolloClient } from './graphql/client'
import { isValidMail } from '../func/isValidMail'

export const getUsername = async () => {
  const userData = await apolloClient.query({
    query: gql`
      query CurrentUser($id: String!) {
        getUser(_id: $id) {
          username
        }
      }
    `,
    variables: {
      id: await getUserId()
    }
  })

  return get('data.getUser.username')(userData)
}

export const getUserId = () => userId()

export const isAuthenticated = async () => !!(await userId())

export const doLogin = (username, password) =>
  loginWithPassword({ username, password }, apolloClient)

export const hasInvalidPassword = password => password.length < 6

export const hasInvalidUserCredentials = (username, password, email) =>
  username.length < 3 ||
  (!isUndefined(email) && !isValidMail(email)) ||
  hasInvalidPassword(password)

export const createUser = async (username, email, password) => {
  if (hasInvalidUserCredentials(username, password, email)) {
    throw new Error('length requirements wrong')
  }

  return apolloCreateUser({ username, email, password }, apolloClient)
}

export const sendForgotPasswordMail = email =>
  forgotPassword({ email }, apolloClient)

export const resetPassword = (newPassword, token) =>
  apolloResetPassword({ newPassword, token }, apolloClient)

export const logOut = () => logout(apolloClient)
