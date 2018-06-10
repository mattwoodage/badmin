var mongoose = require('mongoose');

var memberSchema = mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  active: Boolean,
  roles: String,
  _old: String,
  key: String
})

var Member = mongoose.model('Member', memberSchema)

module.exports = Member
