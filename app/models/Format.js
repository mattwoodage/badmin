var mongoose = require('mongoose');

var formatSchema = mongoose.Schema({
  players: Number,
  label: String,
  short: String,
  category: String
})

var Format = mongoose.model('Format', formatSchema)

module.exports = Format
