import mongoose from 'mongoose'

var seasonSchema = mongoose.Schema({
  label: String,
  period: String,
  current: Boolean,
  _old: Number,
  league: Object,
  startYear: Number,
  createdAt: Date,
  key: String
})

const Season = mongoose.model('Season', seasonSchema)

export default Season
