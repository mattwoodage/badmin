import mongoose from 'mongoose'

var playerSchema = mongoose.Schema({
  name: String,
  firstName: String,
  lastName: String,
  swap: Boolean,
  gender: String,
  membershipNum: String,
  key: String,
  _old: Number
})

var Player = mongoose.model('Player', playerSchema)

export default Player
