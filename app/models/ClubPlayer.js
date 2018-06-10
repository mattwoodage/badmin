var mongoose = require('mongoose');

var clubPlayerSchema = mongoose.Schema({

  name: String,
  firstName: String,
  lastName: String,
  swap: Boolean,
  gender: String,
  membershipNum: String,
  key: String,
  _old: Number
})

var ClubPlayer = mongoose.model('ClubPlayer', clubPlayerSchema)

module.exports = ClubPlayer
