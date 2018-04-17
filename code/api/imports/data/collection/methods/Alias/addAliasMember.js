import { aliasCollection } from '../../AliasCollection'
import { fetchOneAliasById } from './fetchOneAliasById'

export const addAliasMember = aliasId => userId => {
  const alias = fetchOneAliasById(aliasId)

  if (!alias) throw new Error('Alias not found')

  if (alias.memberIds.includes(userId)) { throw new Error('User already part of alias') }

  if (alias.invitedMemberIds.includes(userId)) { throw new Error('User already invited') }

  aliasCollection.update(
    { _id: aliasId },
    {
      $addToSet: { invitedMemberIds: userId },
    }
  )

  return fetchOneAliasById(alias)
}
