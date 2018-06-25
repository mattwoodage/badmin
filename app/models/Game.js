var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({

  scoreCard: Object,
  isHomeTeam: Boolean,
  win: Boolean,
  rubberNum: Number,
  gameNum: Number,
  conceded: Boolean,
  totalRubbers: Number,
  totalGames: Number,
  totalPoints: Number
  totalAttendance: Number,
  leaguePoints: Number,
  key: String,
  _old: String
})

var Game = mongoose.model('Game', gameSchema)

module.exports =  Game
