import { getUserForContext } from 'meteor/apollo'

export const getRequiredUserFromToken = async userLoginToken => {
  if (!userLoginToken) return false

  const { user } = await getUserForContext(userLoginToken)

  if (Object.keys(user).length === 0) return false

  return user
}
