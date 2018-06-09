var mongoose = require('mongoose');

var divisionSchema = mongoose.Schema({
  labelLocal: String,
  label: String,
  teams: [],
  key: String,
  _old: Number,
  season: Object,
  position: Number,
  title: String
})

var Division = mongoose.model('Division', divisionSchema)

module.exports = Division
