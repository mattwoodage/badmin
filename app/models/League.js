var mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
  name: String,
  short: String
})

const League = mongoose.model('League', leagueSchema)

module.exports = League
