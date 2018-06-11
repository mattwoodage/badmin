var mongoose = require('mongoose');

var scoreSchema = mongoose.Schema({
  scoreCard: Object,

  isHomeTeam: Boolean,
  win: Boolean,
  conceded: Boolean,
  totalRubbers: Number,
  totalGames: Number,
  totalPoints: Number
  totalAttendance: Number,
  leaguePoints: Number

})

var Score = mongoose.model('Score', scoreSchema)

module.exports =  Score
