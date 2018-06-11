var mongoose = require('mongoose');

var scoreCardSchema = mongoose.Schema({
  match: Object,

  enteredAt: Date,
  enteredBy: Object,
  enteredByTeam: Object,
  confirmedAt: Date,
  confirmedBy: Object,
  confirmedByTeam: Object,
  status: Number

})

var ScoreCard = mongoose.model('ScoreCard', scoreCardSchema)

module.exports =  ScoreCard
