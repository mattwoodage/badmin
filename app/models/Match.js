var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  label: String,
  startAt: Date,
  division: Object,
  homeTeam: Object,
  awayTeam: Object,
  numCourts: Number,
  venue: Object,
  startAt: Date,
  key: String,
  _old: Number
})

var Match = mongoose.model('Match', matchSchema)

module.exports =  Match




id|division|venue|dt|home_team|away_team|courts|
1|26|1|13.12.2015 20:00:00|141|144|2|


home_authorised|away_authorised|home_captain|away_captain|played|home_rubbers|away_rubbers|drawn_rubbers|home_games|away_games|home_points|away_points|home_attendence|away_attendence|home_PTS|away_PTS|status|confirmed|key|submitted_by|submitted_dt|confirmed_by|confirmed_dt|

||||141|5|1|0|10|2|244|184|4|4|3|1|0|3||0|||