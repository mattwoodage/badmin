import mongoose from 'mongoose'

var divisionSchema = mongoose.Schema({
  key: String,
  _old: Number,
  _fmt: Number,
  labelLocal: String,
  label: String,
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  position: Number,
  alias: String,
  category: String,
  categoryShort: String,
  short: String,
  males: Boolean,
  females: Boolean,
  numPlayers: Number,
  numPerSide: Number,
  numGamesPerRubber: Number,
  numMatches: Number,
  numRubbers: Number,
  genders: String,
  orderOfPlay: Array,
  color: String,
  desc: String,
  ptsWinBy2: Number,
  ptsWinBy1: Number,
  ptsDraw: Number,
  ptsLoseBy1: Number,
  ptsLoseBy2: Number,
  ptsFullTeam: Number,
  canDraw: Boolean
})

divisionSchema.pre('save', function (next) {
  this.labelLocal = [this.category,this.alias || this.position].join(' ')

  this.orderOfPlay = this.orderOfPlay[0].split(',')
  return next();
});

var Division = mongoose.model('Division', divisionSchema)

export default Division
