
var League = require('../app/models/League')
var Season = require('../app/models/Season')
var Division = require('../app/models/Division')
var Team = require('../app/models/Team')
var Match = require('../app/models/Match')
var ScoreCard = require('../app/models/ScoreCard')
var Game = require('../app/models/Game')
var Club = require('../app/models/Club')
var Venue = require('../app/models/Venue')
var Format = require('../app/models/Format')
var Player = require('../app/models/Player')
var Member = require('../app/models/Member')
var User = require('../app/models/User')


var fs = require('fs')

class ImportData {

  constructor(req, res) {

    const leagueShort = req.headers.host.split('.')[0].toUpperCase()

    console.log('IMPORT DATA FOR ', leagueShort)

    this.res = res
    this.leagueShort = leagueShort
    this.queue = ['club','club_player','division','match','player','rubber','season','team','venue']
    this.data = {}
    this.log = {}

    this.loadFile()
  }

  loadFile () {
    const _this = this
    if (this.queue.length === 0) { return this.loadFinished() }
    const table = this.queue.pop()
    const file = `./import/${this.leagueShort}-${table}.csv`

    fs.readFile(file, function (err, str) {
      if (err) {
        throw err
      }
      _this.data[table] = str.toString()
      _this.loadFile()
    })
  }

  loadFinished () {
    console.log('****** L O A D       D O N E ******')

    this.processLeague()
      .then(() => {
        return this.processSuperadmin()
      })
      // .then(() => {
      //   return this.processSeasons()
      // })
      // .then(() => {
      //   return this.processDivisions()
      // })
      // .then(() => {
      //   return this.processClubs()
      // })
      // .then(() => {
      //   return this.processTeams()
      // })
      // .then(() => {
      //   return this.processPlayers()
      // })
      // .then(() => {
      //   return this.processClubPlayers()
      // })
      .then(() => {
        return this.processMatches()
      })
      .then(() => {
        return this.processRubbers()
      })
      .then(() => {
        console.log('****** P R O C E S S I N G       D O N E ******')

        this.res.json(this.log)
      })
  }

  findOrCreate (_model, filter) {
    return new Promise((resolve, reject) => {
      _model.findOne(filter).exec((err, found) => {
        if (err) reject(err)
        if (found) {
          resolve(found)
        }
        resolve(new _model(filter))
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  saveOrUpdate (object, modelName, log) {
    return new Promise((resolve, reject) => {
      object.save((err, obj) => {
        if (err) {
          log.errors.push(err)
          reject(err)
        } else {
          log.saved += 1
        }
        log.processed += 1
        console.log('SAVED ', obj)
        if (log.processed === log.total) {
          this.log[modelName] = log
          resolve({obj:obj, done:true})
        }
        resolve({obj:obj, done:false})
        
      })
    })
  }

  processLeague () {
    return new Promise((resolve, reject) => {
      this.findOrCreate(League, { short: this.leagueShort } )
        .then(league => {
          this.league = league
          resolve(league)
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }

  newLog (rows) {
    return { saved: 0, processed: 0, total: rows.length-1, errors: [] }
  }

  processSuperadmin () {
    return new Promise((resolve, reject) => {
      this.findOrCreate(User, { superadmin: true } )
        .then(superadmin => {
          this.superadmin = superadmin
          resolve(superadmin)
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }

  processSeasons () {
    console.log('P R O C E S S     S E A S O N S')
    const rows = this.data['season'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return
        const uid = this.leagueShort + ' ' + cols[1]
        const key = uid.toLowerCase().split(' ').join('-')
        this.findOrCreate(Season, { _old: cols[0], league: this.league._id } )
          .then(season => {
            season.key = key
            season.label = uid
            season.period = cols[1]
            season.startYear = Number(cols[1].split('-')[0])
            season._old = cols[0]
            season.current = Number(cols[2]) === 0 ? false : true
            season.league = this.league._id

            this.saveOrUpdate(season, 'season', log)
              .then((result) => {
                if (result.done) resolve()
              })
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      }
    })
  }

  processDivisions () {
    console.log('P R O C E S S     D I V I S I O N S')
    const rows = this.data['division'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {
      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        this.findOrCreate(Season, { _old: cols[1], league: this.league._id })
          .then(season => {

            const uid = cols[2] + ' ' + cols[3] + ' ' + this.leagueShort + ' ' + season.period
            const key = uid.toLowerCase().split(' ').join('-')
            this.findOrCreate(Division, {_old: cols[0]} )
              .then(division => {
                division.key = key
                division.label = uid
                division._old = cols[0]
                division.season = season._id
                division.labelLocal = cols[2] + ' ' + cols[3]
                division.position = cols[3]
                division.title = (Number(cols[3])===0) ? 'Premier' : ''

                this.saveOrUpdate(division, 'divisions', log)
                  .then((result) => {
                    if (result.done) resolve()
                  })

              })
          })
      }
    })
  }

  processClubs () {
    console.log('P R O C E S S     C L U B S')
    const rows = this.data['club'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        this.findOrCreate(Venue, { _old: cols[3] } )
          .then(venue => {

          const uid = cols[1]
          const key = uid.toLowerCase().split(' ').join('-')
          this.findOrCreate(Club, { _old: cols[0] } )
            .then(club => {
              club._old = cols[0]
              club.key = key
              club.name = cols[1]
              club.short = cols[2]

              club.clubnightVenue = venue._id
              club.matchVenue = venue._id
              club.message = ''
              club.phone = cols[10] + ":::::" + cols[11] + ":::::" + cols[3] + ":::::" + cols[4] + ":::::" + cols[5] + ":::::" + cols[6] + ":::::" + cols[7] + ":::::" + cols[12] + ":::::" + cols[13] + ":::::" + cols[14]
              club.website = ''
              club.email = ''

              this.saveOrUpdate(club, 'clubs', log)
                .then((result) => {
                  if (result.done) resolve()
                })
            })
        })
      }
    })
  }

  processTeams () {
    console.log('P R O C E S S     T E A M S')
    const rows = this.data['team'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        this.findOrCreate(Club, { _old: cols[3] } )
          .then(club => {

            this.findOrCreate(Division, { _old: cols[1] } )
              .then(division => {
                const teamName = (club.name + ' ' + cols[2]).trim()
                const uid = teamName + ' ' + division.label
                const key = uid.toLowerCase().split(' ').join('-')
                this.findOrCreate(Team, { _old: cols[0] } )
                  .then(team => {
                    team._old = cols[0]
                    team.key = key
                    team.label = uid
                    team.labelLocal = teamName
                    team.division = division._id
                    team.prefix = cols[2]
                    team.club = club._id

                    this.saveOrUpdate(team, 'teams', log)
                      .then((result) => {
                        if (result.done) resolve()
                      })
                  })
              })
          })
      }
    })
  }


  processPlayers () {
    console.log('P R O C E S S     P L A Y E R S')
    const rows = this.data['player'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        const uid = cols[0] + ' ' + cols[1] + ' ' + cols[2]
        const key = uid.toLowerCase().split(' ').join('-')
        this.findOrCreate(Player, { _old: cols[0] } )
          .then(player => {
            player.key = key
            player.firstName = cols[1]
            player.lastName = cols[2]
            player.name = cols[1] + ' ' + cols[2].toUpperCase()
            player._old = cols[0]
            player.gender = cols[3]

            this.saveOrUpdate(player, 'players', log)
              .then((result) => {
                if (result.done) resolve()
              })
          })
      }
    })
  }


  processClubPlayers () {
    console.log('P R O C E S S     C L U B  P L A Y E R S -> M E M B E R S')
    const rows = this.data['club_player'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        this.findOrCreate(Player, { _old: cols[0] } )
          .then(player => {

            this.findOrCreate(Club, { _old: cols[1] } )
              .then(club => {

                const uid = cols[0] + ',' + cols[1]
                const key = uid.toLowerCase().split(' ').join('-')
                this.findOrCreate(Member, { _old: uid } )
                  .then(member => {
                    member.key = key
                    member.club = club._id
                    member.player = player._id
                    member.active = Number(cols[2]) === 1 ? true : false
                    member.roles = cols[3]

                    this.saveOrUpdate(member, 'members', log)
                      .then((result) => {
                        if (result.done) resolve()
                      })
                  })
              })
          })
      }
    })
  }


  processMatches () {
    console.log('P R O C E S S     M A T C H E S')
    const rows = this.data['match'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        const mths = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',')

        this.findOrCreate(Division, { _old: cols[1] } )
          .then(division => {

            this.findOrCreate(Venue, { _old: cols[2] } )
              .then(venue => {

                this.findOrCreate(Team, { _old: cols[4] } )
                  .then(homeTeam => {

                    this.findOrCreate(Team, { _old: cols[5] } )
                      .then(awayTeam => {

                        const uid = homeTeam.labelLocal + ' vs ' + awayTeam.labelLocal + ' ' + String(division.key)
                        const key = uid.toLowerCase().split(' ').join('-')
                        this.findOrCreate(Match, { _old: cols[0] } )
                          .then(match => {
                            let dt = cols[3]
                            dt = dt.split('.')
                            dt[1] = mths[Number(dt[1])-1]
                            dt = dt.join(' ')
                            match.key = key
                            match.division = division._id
                            match.venue = venue._id
                            match.homeTeam = homeTeam._id
                            match.awayTeam = awayTeam._id
                            match.startAt = new Date(dt)
                            match.label = homeTeam.labelLocal + ' vs ' + awayTeam.labelLocal

                            this.saveOrUpdate(match, 'matches', log)
                              .then((result) => {
                                if (result.done) resolve()
                              })
                          })
                      })
                  })
              })
          })
      }
    })
  }


//id|match|num|home_p1|home_p2|away_p1|away_p2|home_g1_score|away_g1_score|home_g2_score|away_g2_score|home_g3_score|away_g3_score|
//19|136|1|126|122|97|101|14|21|19|21|0|0

// SCORECARD
// match: Object,
// enteredAt: Date,
// enteredBy: Object,
// enteredByTeam: Object,
// confirmedAt: Date,
// confirmedBy: Object,
// confirmedByTeam: Object,
// status: Number

  processRubbers () {
    console.log('P R O C E S S     R U B B E R S')
    const rows = this.data['rubber'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        this.findOrCreate(Match, { _old: cols[1] } )
          .then(match => {

            this.findOrCreate(Player, { _old: cols[3] } )
              .then(player_h1 => {

                this.findOrCreate(Player, { _old: cols[4] } )
                  .then(player_h2 => {

                    this.findOrCreate(Team, { _old: cols[5] } )
                      .then(player_a1 => {

                        this.findOrCreate(Team, { _old: cols[6] } )
                          .then(player_a2 => {

                            const uid = String(match.key) + ' CARD' 
                            const key = uid.toLowerCase().split(' ').join('-')
                            this.findOrCreate(ScoreCard, { key: key } )
                              .then(scoreCard => {

                                scoreCard.match = match._id
                                scoreCard._old = cols[0]
                                scoreCard.enteredAt = new Date(),
                                scoreCard.enteredBy = this.superadmin._id,
                                scoreCard.enteredByTeam = undefined,
                                scoreCard.confirmedAt = new Date(),
                                scoreCard.confirmedBy = this.superadmin._id,
                                scoreCard.confirmedByTeam = undefined,
                                scoreCard.status = 1

                                this.saveOrUpdate(scoreCard, 'scorecards', log)
                                  .then((result) => {
                                    scoreCard = result.obj
                                    
                                    const rubberNum = cols[2]
                                    let idx = 5
                                    for (var gameNum = 1; gameNum<=3; gameNum++) {

                                      const game_uid = String(match.key) + ' ' + rubberNum + ' ' + gameNum
                                      const game_key = game_uid.toLowerCase().split(' ').join('-')

                                      //home
                                      const homePts = cols[idx+gameNum*2]
                                      const awayPts = cols[idx+(gameNum*2)+1]
                                      const homeWin = (homePts>awayPts)

                                      if (homePts + awayPts > 0) {
                                        this.findOrCreate(Game, { key: game_key + '-home' } )
                                          .then(game => {
                                            game.scoreCard = scoreCard._id
                                            game.rubberNum = rubberNum
                                            game.gameNum = gameNum
                                            game.isHomeTeam = true
                                            game.players = [player_h1._id, player_h2._id]
                                            game.points = homePts
                                            game.conceded = false
                                            game.win = homeWin
                                            
                                            this.saveOrUpdate(game, 'games', log)
                                          })
                                        //away
                                        this.findOrCreate(Game, { key: game_key + '-away' } )
                                          .then(game => {
                                            game.scoreCard = scoreCard._id
                                            game.rubberNum = rubberNum
                                            game.gameNum = gameNum
                                            game.isHomeTeam = false
                                            game.players = [player_a1._id, player_a2._id]
                                            game.points = awayPts
                                            game.conceded = false
                                            game.win = !homeWin
                                            
                                            this.saveOrUpdate(game, 'games', log)
                                          })
                                      }
                                    }

                                    if (result.done) resolve()
                                  })

                              })
                          })
                      })
                  })
              })
          })
      }
    })
  }


  processVenues () {
    console.log('P R O C E S S     V E N U E S')
    const rows = this.data['venue'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {

      for (var r of rows) {
        const cols = r.split('|')

        if (!cols[1]) return

        const uid = cols[1]
        const key = cols[1].toLowerCase().split(' ').join('-')
        this.findOrCreate(Venue, { _old: cols[0] } )
          .then(venue => {
            venue.key = key
            venue.name = cols[1]
            venue._old = cols[0]
            venue.address_1 = cols[2]
            venue.address_2 = cols[3]
            venue.address_3 = ''
            venue.town = cols[4]
            venue.postcode = cols[5].toUpperCase()
            venue.website = cols[6]
            venue.lat = cols[7] + ',' + cols[8]
            venue.lng = cols[9] + ',' + cols[10]

            this.saveOrUpdate(venue, 'venues', log)
              .then((result) => {
                if (result.done) resolve()
              })
          })
      }
    })

  }
}

module.exports = ImportData;

