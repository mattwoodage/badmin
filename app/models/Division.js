var mongoose = require('mongoose');

var divisionSchema = mongoose.Schema({
  labelLocal: String,
  label: String,
  teams: []
})

var Division = mongoose.model('Division', divisionSchema)

module.exports = Division
