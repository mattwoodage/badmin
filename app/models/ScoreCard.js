import mongoose from 'mongoose'

var scoreCardSchema = mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  key: String,
  _old: Number,
  enteredAt: Date,
  enteredBy: Object,
  enteredByTeam: Object,
  confirmedAt: Date,
  confirmedBy: Object,
  confirmedByTeam: Object,
  conceded: Boolean,
  homeRubbers: Number,
  awayRubbers: Number,
  homePts: Number,
  awayPts: Number,
  leaguePoints: Number,
  homePlayers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } ],
  awayPlayers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } ],
  scores: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Score' } ],
  status: Number // 1 = CONFIRMED (all old ones)   0 = SUPERCEDED

})

var ScoreCard = mongoose.model('ScoreCard', scoreCardSchema)

export default ScoreCard
