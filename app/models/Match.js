import mongoose from 'mongoose'

var matchSchema = mongoose.Schema({
  label: String,
  startAt: Date,
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  numCourts: Number,
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  startAt: Date,
  key: String,
  scoreCard: { type: mongoose.Schema.Types.ObjectId, ref: 'ScoreCard' },
  _old: Number
})

var Match = mongoose.model('Match', matchSchema)

export default Match
