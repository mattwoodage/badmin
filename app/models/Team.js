import mongoose from 'mongoose'
import Division from './Division'
import Club from './Club'

var teamSchema = mongoose.Schema({
  labelClub: String,
  labelClubShort: String,
  labelDivision: String,
  short: String,
  key: String,
  _old: Number,
  label: String,
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
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

teamSchema.pre('save', function (next) {
  var team = this;
  Division.findOne({_id: team.division}).exec((err, division) => {
    if (division) {
      let lbl = division.category
      if (team.prefix.length>0) lbl += ' ' + team.prefix
      team.key = (lbl + '-' + division.key).toLowerCase().split(' ').join('-')
      team.labelDivision = lbl
      Club.findOne({_id: team.club}).exec((err, club) => {
        if (club) {
          let lbl = club.name
          if (team.prefix.length>0) lbl += ' ' + team.prefix
          lbl = club.short
          if (team.prefix.length>0) lbl += ' ' + team.prefix
          team.labelClubShort = lbl
          return next();
        }
      })
    }
  })
});

const Team = mongoose.model('Team', teamSchema)

export default Team
