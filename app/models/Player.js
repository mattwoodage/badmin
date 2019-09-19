import mongoose from 'mongoose'

var playerSchema = mongoose.Schema({
  name: String,
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  swap: Boolean,
  gender: String,
  active: Boolean,
  membershipNum: String,
  key: String,
  _old: Number
})

var Player = mongoose.model('Player', playerSchema)

export default Player
