var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  labelLocal: String,
  short: String,
  key: String,
  _old: Number,
  label: String,
  club: Object,
  prefix: String,
  division: Object
})

var Team = mongoose.model('Team', teamSchema)

module.exports = Team
