var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
  score: Object,

  isHomeTeam: Boolean,
  win: Boolean,
  conceded: Boolean,
  totalRubbers: Number,
  totalGames: Number,
  totalPoints: Number
  totalAttendance: Number,
  leaguePoints: Number

})

var Game = mongoose.model('Game', gameSchema)

module.exports =  Game
