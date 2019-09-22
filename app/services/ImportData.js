

import League from '../models/League'
import Season from '../models/Season'
import Division from '../models/Division'
import Team from '../models/Team'
import Match from '../models/Match'
import ScoreCard from '../models/ScoreCard'
import Score from '../models/Score'
import Club from '../models/Club'
import Venue from '../models/Venue'

import Player from '../models/Player'
import Member from '../models/Member'
import User from '../models/User'


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
    if (this.queue.length === 0) { return this.processAll() }
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

  processAll () {
    console.log('****** P R O C E S S    A L L ******')

    this.processLeague()
       .then(() => {
         this.processSuperadmin()
          .then(() => {
            this.processSeasons()
              .then(() => {
                 this.processDivisions()
                  .then(() => {
                    this.processVenues()
                      .then(() => {
                        this.processClubs()
                          .then(() => {
                            this.processTeams()
                              .then(() => {
                                this.processPlayers()
                                  .then(() => {
                                    this.processClubPlayers()
                                      .then(() => {
                                        this.processMatches()
                                          .then(() => {
                                             this.processRubbers()
                                               .then(() => {
                                                console.log('****** P R O C E S S I N G       D O N E ******')

                                                setTimeout(() => {
                                                  this.res.json(this.log)
                                                }, 2000)
                                              })
                                              .catch(error => {
                                                console.error('processAll:', error)
                                              })
                                          })
                                      })
                                  })
                              })
                          })
                      })
                  })
              })
          })
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
      console.error('findOrCreate:', error)
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
        if (log.processed === log.total) {
          this.log[modelName] = log
          resolve({obj:obj, done:true})
        }
        resolve({obj:obj, done:false})
        
      })
    })
    .catch(error => {
      console.error('saveOrUpdate:', error)
    })
  }

  processLeague () {
    return new Promise((resolve, reject) => {
      this.findOrCreate(League, { short: this.leagueShort } )
        .then(league => {
          this.league = league
          this.saveOrUpdate(league, 'league', log)
            .then((result) => {
              resolve()
            })
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
    .catch(error => {
      console.error('processLeague:', error)
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
    .catch(error => {
      console.error('processSuperadmin:', error)
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
    .catch(error => {
      console.error('processSeasons:', error)
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
                division._fmt = cols[7]
                division.season = season._id
                division.labelLocal = cols[2] + ' ' + cols[3]
                division.position = cols[3]
                division.alias = (Number(cols[3])===0) ? 'Premier' : ''

                division.category = cols[2]
                division.categoryShort = cols[10]
                division.short = ""
                division.males = cols[9].indexOf('M')>-1 || cols[9].indexOf('O')>-1
                division.females = cols[9].indexOf('F')>-1 || cols[9].indexOf('O')>-1
                division.numPlayers = cols[4]
                division.numPerSide = 2
                division.numRubbers = cols[5]
                division.numGamesPerRubber = cols[6]
                division.numMatches = parseInt(cols[11] || 1)
                  
                if (cols[9].indexOf('O')>-1) {
                  division.genders = "OOOOOOOOOO".substr(0,parseInt(cols[4]))
                }
                else if (cols[9]=="FM") {
                  division.genders = "FMFMFMFMFMFMFMFM".substr(0,parseInt(cols[4]))
                }
                else if (cols[9]=="M") {
                  division.genders = "MMMMMMMMMMMM".substr(0,parseInt(cols[4]))
                }
                else if (cols[9]=="F") {
                  division.genders = "FFFFFFFFFFFF".substr(0,parseInt(cols[4]))
                }
                division.orderOfPlay = this.getOrderOfPlay(parseInt(cols[7]))
                division.color = cols[8]
                division.desc = ""

                division.ptsWinBy2 = cols[13]
                division.ptsWinBy1 = cols[14]
                division.ptsDraw = cols[18]
                division.ptsLoseBy1 = cols[16]
                division.ptsLoseBy2 = cols[15]
                division.ptsFullTeam = cols[17]
                division.canDraw = cols[19]

                this.saveOrUpdate(division, 'divisions', log)
                  .then((result) => {
                    if (result.done) resolve()
                  })

              })
          })
      }
    })
  }

  getOrderOfPlay(fmt) {
    let o = []
    if (fmt== 1) {
      o.push("1212")
      o.push("3434")
      o.push("2314")
      o.push("1423")
      o.push("1313")
      o.push("2424")
      o.push("1414")
      o.push("2323")
    }
    if (fmt == 2) {
      o.push("1212")
      o.push("3434")
      o.push("5656")
      o.push("3412")
      o.push("1256")
      o.push("5634")
      o.push("3456")
      o.push("5612")
      o.push("1234")
    }
    if (fmt == 3) {
      o.push("1212")
      o.push("3434")
      o.push("1234")
      o.push("3412")
      o.push("1313")
      o.push("2424")
      o.push("1324")
      o.push("2413")
    }
    if (fmt == 4) {
      o.push("1212")
      o.push("3434")
      o.push("1234")
      o.push("3412")
      o.push("1414")
      o.push("2323")
      o.push("1423")
      o.push("2314")
    }
    if (fmt == 5) {
      o.push("1212")
      o.push("3434")
      o.push("5656")
      o.push("3412")
      o.push("5634")
      o.push("1256")
      o.push("5612")
      o.push("1234")
      o.push("3456")
    }
    if (fmt == 6) { //hwba ladies di 2
      o.push("1212")
      o.push("3434")
      o.push("3412")
      o.push("1234")
      o.push("1313")
      o.push("2424")
    }
    if (fmt == 7) { //reading ladies di 3
      o.push("1212")
      o.push("3434")
      o.push("1234")
      o.push("3412")
      o.push("1313")
      o.push("2424")
    }
    return o
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
              club.clubnightAltVenue = venue._id
              club.matchAltVenue = venue._id
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
                let labelDivision = division.category
                if (cols[2].length) labelDivision += ' ' + cols[2]
                this.findOrCreate(Team, { _old: cols[0] } )
                  .then(team => {
                    team._old = cols[0]
                    team.key = key
                    team.label = uid
                    team.labelClub = teamName
                    team.labelDivision = labelDivision
                    team.division = division._id
                    team.prefix = cols[2]
                    team.club = club._id
                    team.matchesWon = 0
                    team.matchesFull = 0
                    team.matchesLost = 0
                    team.matchesDrawn = 0
                    team.matchesTotal = 0
                    team.rubbersWon = 0
                    team.rubbersLost = 0
                    team.rubbersDrawn = 0
                    team.gamesWon = 0
                    team.gamesLost = 0
                    team.pointsWon = 0
                    team.pointsLost = 0
                    team.pos = 0
                    team.pts = 0

                    this.saveOrUpdate(team, 'teams', log)
                      .then((result) => {
                        if (result.done) resolve()
                      })
                      .catch((err) => {
                        console.log(err)
                        
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

                        const uid = homeTeam.labelClub + ' vs ' + awayTeam.labelClub + ' ' + String(division.key)
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
                            match.label = homeTeam.labelClub + ' vs ' + awayTeam.labelClub

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
    let rows = this.data['rubber'].split('\r\n')
    const fields = rows.shift()

    const log = this.newLog(rows)

    return new Promise((resolve, reject) => {
      this.processNextRubber(0, rows, log, resolve)
    })
  }

  processNextRubber (idx, rows, log, _resolve) {
    
    console.log('* * * pnr', idx)

    return new Promise((resolve, reject) => {

      const cols = rows[idx].split('|')

      if (!cols[1]) resolve()

      this.findOrCreate(Match, { _old: cols[1] } )
        .then(match => {

          this.findOrCreate(Division, { _id: match.division } )
            .then(division => {

              this.findOrCreate(Player, { _old: cols[3] } )
                .then(player_h1 => {

                  this.findOrCreate(Player, { _old: cols[4] } )
                    .then(player_h2 => {

                      this.findOrCreate(Player, { _old: cols[5] } )
                        .then(player_a1 => {

                          this.findOrCreate(Player, { _old: cols[6] } )
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

                                  if (cols[2] == 1) {
                                    scoreCard.homePlayers = [player_h1._id, player_h2._id]
                                    scoreCard.awayPlayers = [player_a1._id, player_a2._id]
                                  }
                                  else if (cols[2] == 2) {
                                    scoreCard.homePlayers.push(player_h1._id)
                                    scoreCard.homePlayers.push(player_h2._id)
                                    scoreCard.awayPlayers.push(player_a1._id)
                                    scoreCard.awayPlayers.push(player_a2._id)
                                  }
                                  else if (cols[2] == 3) {
                                    console.log('* * * game 3', division.numPlayers, division.numPlayers>4)
                                    if (division.numPlayers>4) {
                                      console.log('* * * * * * * * * * 6 created')
                                      scoreCard.homePlayers.push(player_h1._id)
                                      scoreCard.homePlayers.push(player_h2._id)
                                      scoreCard.awayPlayers.push(player_a1._id)
                                      scoreCard.awayPlayers.push(player_a2._id)
                                    }
                                  }

                                  
                                  match.scoreCard = scoreCard._id
                                  match.save()

                                  const scoreCardLog = this.newLog([1])

                                  console.log('* * * player count now equals =  ',scoreCard.homePlayers.length,scoreCard.awayPlayers.length)

                                  this.saveOrUpdate(scoreCard, 'scorecards', scoreCardLog)
                                    .then((result) => {
                                      scoreCard = result.obj
                                      return this.processNextGame (match, scoreCard, player_h1, player_h2, player_a1, player_a2, cols, 1)
                                      .then(() => {
                                        return this.processNextGame (match, scoreCard, player_h1, player_h2, player_a1, player_a2, cols, 2)
                                        .then(() => {
                                          return this.processNextGame (match, scoreCard, player_h1, player_h2, player_a1, player_a2, cols, 3)
                                        })
                                      })
                                    })
                                    .then( () => {
                                      idx += 1
                                      if (rows[idx]) {
                                        return this.processNextRubber(idx, rows, log, _resolve)
                                      } else {
                                        console.log('pnr DONE')
                                        resolve()
                                      }
                                    })

                                })
                            })
                        })
                    })
                })
            })
        })
        
    })
    .then(() => {
      console.log('xxxx DONE xxxx')
      _resolve()
    })
    .catch(error => {
      console.error('processNextRubber:', error)
    })
  }

  processNextGame (match, scoreCard, player_h1, player_h2, player_a1, player_a2, cols, gameNum) {
    return new Promise((resolve, reject) => {

      const rubberNum = cols[2]
      const game_uid = String(match.key) + ' ' + rubberNum + ' ' + gameNum
      const game_key = game_uid.toLowerCase().split(' ').join('-')

      //home
      const homePts = cols[5+gameNum*2]
      const awayPts = cols[5+(gameNum*2)+1]
      const homeWin = (parseInt(homePts)>parseInt(awayPts))

      const scoreLog = this.newLog([1])

      if (homePts + awayPts > 0) {
        this.findOrCreate(Score, { key: game_key + '-home' } )
          .then(scoreH => {
            scoreH.scoreCard = scoreCard._id
            scoreH.rubberNum = rubberNum
            scoreH.gameNum = gameNum
            scoreH.isHomeTeam = true
            scoreH.players = [player_h1._id, player_h2._id]
            scoreH.points = homePts
            scoreH.conceded = false
            scoreH.win = homeWin
            
            this.saveOrUpdate(scoreH, 'scores', scoreLog)
              .then(() => {
                this.findOrCreate(Score, { key: game_key + '-away' } )
                  .then(scoreA => {
                    scoreA.scoreCard = scoreCard._id
                    scoreA.rubberNum = rubberNum
                    scoreA.gameNum = gameNum
                    scoreA.isHomeTeam = false
                    scoreA.players = [player_a1._id, player_a2._id]
                    scoreA.points = awayPts
                    scoreA.conceded = false
                    scoreA.win = !homeWin
                    
                    this.saveOrUpdate(scoreA, 'scores', scoreLog)
                      .then(() => {
                        resolve()
                      })
                  })
              })
          })
      } else {
        resolve()
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
            venue.lat = cols[7]
            venue.lng = cols[8]

            this.saveOrUpdate(venue, 'venues', log)
              .then((result) => {
                if (result.done) resolve()
              })
          })
      }
    })

  }
}

export default ImportData;

