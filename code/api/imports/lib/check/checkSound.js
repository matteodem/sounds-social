import { Match } from 'meteor/check'
import { fetchOneSoundById } from '../../data/collection/methods/Sound/fetchOneSoundById'
import { checkRequired } from './check'

export const checkSound = _id => {
  if (!fetchOneSoundById(_id)) throw new Error('Sound not found')
}

export const checkSoundData = checkRequired({
  name: String,
  description: Match.Maybe(String),
  createdAt: Date,
  creatorId: String,
  isPublic: Boolean,
  file: {
    _id: String,
    secret: String,
    url: String,
  },
})
