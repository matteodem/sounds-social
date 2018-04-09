import { chai } from 'meteor/practicalmeteor:chai'
import { getRequiredUserFromToken } from './getRequiredUserFromToken'

describe('getRequiredUserFromToken', function() {
  it('returns false on wrong data', function(done) {
    getRequiredUserFromToken('').then(u => {
      chai.expect(u).to.equal(false)

      done()
    })
  })
})
