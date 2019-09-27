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

seasonSchema.pre('save', function (next) {
  this.period = this.startYear.toString() + '-' + ((this.startYear+1)-2000).toString()
  return next();
});

const Season = mongoose.model('Season', seasonSchema)

export default Season
