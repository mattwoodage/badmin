var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  label: String,
  startAt: Date
})

var Match = mongoose.model('Match', matchSchema)

module.exports =  Match
