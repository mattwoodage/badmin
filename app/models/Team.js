var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  labelLocal: String,
  short: String,
  key: String,
  _old: Number,
  label: String,
  club: Object,
  prefix: String,
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
  matchesWon: { type: Number, default: 0 },
  matchesFull: { type: Number, default: 0 },
  matchesLost: { type: Number, default: 0 },
  matchesDrawn: { type: Number, default: 0 },
  matchesTotal: { type: Number, default: 0 },
  rubbersWon: { type: Number, default: 0 },
  rubbersLost: { type: Number, default: 0 },
  rubbersDrawn: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  gamesLost: { type: Number, default: 0 },
  pointsWon: { type: Number, default: 0 },
  pointsLost: { type: Number, default: 0 },
  pos: { type: Number, default: 0 },
  pts: { type: Number, default: 0 }
});

module.exports = mongoose.model('Team', teamSchema);
