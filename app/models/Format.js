var mongoose = require('mongoose');

var formatSchema = mongoose.Schema({
  label: String,
  key: String,
  players: Number,
  category: String,
  short: String,
  males: Boolean,
  females: Boolean,
  pairs: Number,
  numMatches: Number,
  rubbers: Number,
  orderOfPlay: String,
  desc: String
})

var Format = mongoose.model('Format', formatSchema)

module.exports = Format
