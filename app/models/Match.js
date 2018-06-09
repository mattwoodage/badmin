var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  label: String,
  startAt: Date,
  division: Object,
  homeTeam: Object,
  awayTeam: Object,
  venue: Object,
  startAt: Date,
  key: String,
  _old: Number
})

var Match = mongoose.model('Match', matchSchema)

module.exports =  Match
