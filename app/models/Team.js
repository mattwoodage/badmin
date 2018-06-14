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

module.exports = mongoose.model('Team', teamSchema)
