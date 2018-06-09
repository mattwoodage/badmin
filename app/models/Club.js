var mongoose = require('mongoose');

var clubSchema = mongoose.Schema({
  name: String,
  short: String,
  key: String,
  _old: Number,
  email: String,
  website: String,
  phone: String,
  clubnightVenue: Object,
  clubnightStartAt: Date,
  clubnightAltVenue: Object,
  clubnightAltStartAt: Date,
  matchVenue: Object,
  matchStartAt: Date,
  matchAltVenue: Object,
  matchAltStartAt: Date,
  message: String
})

var Club = mongoose.model('Club', clubSchema)

module.exports = Club
