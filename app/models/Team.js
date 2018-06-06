var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  labelLocal: String,
  label: String,
  club: Object,
  division: Object
})

var Team = mongoose.model('Team', teamSchema)


module.exports = Team
