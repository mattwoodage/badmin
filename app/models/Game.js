var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({

  scoreCard: Object,
  isHomeTeam: Boolean,
  win: Boolean,
  players: Array,
  points: Object,
  rubberNum: Number,
  gameNum: Number,
  conceded: Boolean,
  key: String,
  _old: String
})

var Game = mongoose.model('Game', gameSchema)

module.exports =  Game
