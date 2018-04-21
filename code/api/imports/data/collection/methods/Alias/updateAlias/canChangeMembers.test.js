import { canChangeMembers } from './canChangeMembers'
import { chai } from 'meteor/practicalmeteor:chai'

const fakeAlias = {
  _id: 'fakeId',
  creatorId: 'memberIdOne',
  memberIds: ['memberIdOne', 'memberIdTwo', 'memberIdThree'],
}

describe('canChangeMembers', function() {
  it('changes members if reordered', function() {
    expect(
      canChangeMembers(fakeAlias)([
        'memberIdTwo',
        'memberIdThree',
        'memberIdOne',
      ])
    ).to.equal(true)
  })

  it('does not change if creator is not a member anymore', function() {
    expect(
      canChangeMembers(fakeAlias)(['memberIdTwo', 'memberIdThree'])
    ).to.equal(false)
  })

  it('changes if members have been removed', function() {
    expect(
      canChangeMembers(fakeAlias)(['memberIdOne', 'memberIdThree'])
    ).to.equal(true)
  })

  it('does not change if members have been added', function() {
    expect(
      canChangeMembers(fakeAlias)([
        'memberIdOne',
        'memberIdAdditional',
        'memberIdThree',
      ])
    ).to.equal(false)
  })
})
