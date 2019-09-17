import mongoose from 'mongoose'

var divisionSchema = mongoose.Schema({
  key: String,
  _old: Number,
  _fmt: Number,
  labelLocal: String,
  label: String,
  season: Object,
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
  canDraw: Number
})

var Division = mongoose.model('Division', divisionSchema)

export default Division
