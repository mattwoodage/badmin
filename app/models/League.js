import mongoose from 'mongoose'

const leagueSchema = mongoose.Schema({
  name: String,
  short: String
})

const League = mongoose.model('League', leagueSchema)

export default League
