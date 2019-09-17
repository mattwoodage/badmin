import mongoose from 'mongoose'

var scoreSchema = mongoose.Schema({

  scoreCard: { type: mongoose.Schema.Types.ObjectId, ref: 'ScoreCard' },
  isHomeTeam: Boolean,
  win: Boolean,
  players: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } ],
  points: Number,
  rubberNum: Number,
  gameNum: Number,
  conceded: Boolean,
  key: String,
  _old: String
})

var Score = mongoose.model('Score', scoreSchema)

export default Score
