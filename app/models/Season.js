import mongoose from 'mongoose'

var seasonSchema = mongoose.Schema({
  label: String,
  period: String,
  current: Boolean,
  _old: Number,
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  startYear: Number,
  createdAt: Date,
  key: String
})

const Season = mongoose.model('Season', seasonSchema)

export default Season
