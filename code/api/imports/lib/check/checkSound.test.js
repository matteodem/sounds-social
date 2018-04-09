import { checkSoundData } from './checkSound'
import { chai } from 'meteor/practicalmeteor:chai'

describe('checkSoundData', function() {
  it('does nothing on valid data', function() {
    checkSoundData({
      name: 'Wow',
      description: 'Aha',
      createdAt: new Date(),
      creatorId: 'creatorId1',
      isPublic: true,
      file: {
        _id: 'fileId',
        hash: 'fileSecret',
        userId: 'userId',
      },
    })
  })

  it('fails on invalid data', function() {
    try {
      checkSoundData({
        name: 'Wow',
        whataaa: 'Aha',
        createdAt: new Date(),
        creatorId: 'creatorId1',
        isPublic: true,
        file: {
          _id: 'fileId',
          hash: 'fileSecret',
          userId: 'userId',
        },
      })
    } catch (e) {
      expect(e.message).to.contain('Match error: Unknown key')
    }
  })
})
