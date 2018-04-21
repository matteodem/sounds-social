import { checkRequiredString } from '../../../lib/check/check'
import { acceptInvitation } from '../../../data/collection/methods/Alias/acceptInvitation'

export const getInvitationResolver = accept => {
  return (root, args, context) => {
    if (!context.userId) return null
    checkRequiredString(args._id)

    return acceptInvitation(args._id)(context.userId)(accept)
  }
}
