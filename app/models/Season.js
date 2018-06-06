var mongoose = require('mongoose');

var seasonSchema = mongoose.Schema({
  label: String,
  period: String,
  current: Boolean,
  startYear: Number
})

const Season = mongoose.model('Season', seasonSchema)

module.exports = Season
