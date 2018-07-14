var mongoose = require('mongoose');

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
  totalRubbers: Number,
  totalGames: Number,
  totalPoints: Number,
  totalAttendance: Number,
  leaguePoints: Number,
  scores: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Score' } ],
  status: Number, // 1 = CONFIRMED (all old ones)   0 = SUPERCEDED
  rubbers: Array
})

var ScoreCard = mongoose.model('ScoreCard', scoreCardSchema)

module.exports =  ScoreCard
