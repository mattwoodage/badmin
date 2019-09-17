import mongoose from 'mongoose'

var clubSchema = mongoose.Schema({
  name: String,
  short: String,
  key: String,
  _old: Number,
  email: String,
  website: String,
  phone: String,
  clubnightVenue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  clubnightStartAt: Date,
  clubnightAltVenue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  clubnightAltStartAt: Date,
  matchVenue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  matchStartAt: Date,
  matchAltVenue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  matchAltStartAt: Date,
  message: String
})

var Club = mongoose.model('Club', clubSchema)

export default Club
