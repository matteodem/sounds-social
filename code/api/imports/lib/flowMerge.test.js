import { chai } from 'meteor/practicalmeteor:chai'
import { flowMerge } from './flowMerge'

describe('flowMerge', function() {
  it('works as expected', function() {
    chai
      .expect(
        flowMerge(
          () => ({ sort: 1 }),
          () => ({ fields: ['name', '_id'] }),
          () => ({}),
          () => ({ duper: 'nice' }),
          () => ({ duper: 'nice2' }),
        ),
      )
      .to.deep.equal({
        sort: 1,
        fields: ['name', '_id'],
        duper: 'nice2',
      })
  })
})
