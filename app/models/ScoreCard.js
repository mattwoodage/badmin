import mongoose from 'mongoose'

var scoreCardSchema = mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  key: String,
  _old: Number,
  enteredAt: Date,
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enteredByTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  confirmedAt: Date,
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmedByTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  conceded: Boolean,
  homePoints: Number,
  awayPoints: Number,
  homeGames: Number,
  awayGames: Number,
  homeRubbers: Number,
  awayRubbers: Number,
  homePts: Number,
  awayPts: Number,
  winner: Number,
  leaguePoints: Number,
  homePlayers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } ],
  awayPlayers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } ],
  scores: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Score' } ],
  status: Number // 1 = CONFIRMED (all old ones)   0 = SUPERCEDED

})

var ScoreCard = mongoose.model('ScoreCard', scoreCardSchema)

export default ScoreCard
