
var League = require('../app/models/League')
var Season = require('../app/models/Season')
var Division = require('../app/models/Division')
var Team = require('../app/models/Team')
var Match = require('../app/models/Match')
var Club = require('../app/models/Club')
var Venue = require('../app/models/Venue')
var Format = require('../app/models/Format')
var Player = require('../app/models/Player')

var fs = require('fs')

class ImportData {

  constructor(req, res) {

    const leagueShort = req.params.short.toUpperCase()

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

  async loadFinished () {
    console.log('****** L O A D       D O N E ******')

    this.processLeague()
      .then(() => {
        this.processSeasons()
      })
      .then(() => {
        this.processClubs()
      })
      .then(() => {
        this.processTeams()
      })
      .then(() => {
        this.processPlayers()
      })
      .then(() => {
        this.processMatches()
      })
      .then(() => {
        this.processDivisions()
      })
      .then(() => {
        console.log('****** P R O C E S S I N G       D O N E ******')


        this.res.json(this.log)
      })
    // await this.processSeasons()
    // await this.processVenues()
    


    

    
  }

  findOrCreate (_model, field, value) {
    return new Promise((resolve, reject) => {
      const filter = {}
      filter[field] = value
      _model.findOne(filter).exec((err, found) => {
        if (err) reject(err)
        if (found) {
          console.log('*found*')
          resolve(found)
        }
        resolve(new _model())
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  saveOrUpdate (object) {
    if (!object.createdAt) {
      object.save((err) => {
        if (err) {
          console.log('*** ERROR SAVING ***', err)
          return false
        }
        return true
      })
    } else {
      object.update((err) => {
        if (err) {
          console.log('*** ERROR UPDATING ***', err)
        }
        return true
      })
    }
  }

  processLeague () {
    return new Promise((resolve, reject) => {
      this.findOrCreate(League, 'short', this.leagueShort)
        .then(league => {
          this.league = league
          resolve(league)
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  async processSeasons () {
    console.log('P R O C E S S     S E A S O N S')
    const rows = this.data['season'].split('\r\n')
    const fields = rows.shift()

    this.log.seasons = { saved: 0, total: rows.length }

    for (var r of rows) {
      const cols = r.split(',')

      if (!cols[1]) return
      const uid = this.leagueShort + ' ' + cols[1]
      const key = uid.toLowerCase().split(' ').join('-')
      this.findOrCreate(Season, 'key', key)
        .then(season => {
          season.key = key
          season.label = uid
          season.period = cols[1]
          season.startYear = Number(cols[1].split('-')[0])
          season._old = cols[0]
          season.current = Number(cols[2]) === 0 ? false : true
          season.league = this.league._id

          const ok = this.saveOrUpdate(season)
          if (ok) this.log.seasons.saved += 1

        })
    }
  }

  async processDivisions () {
    console.log('P R O C E S S     D I V I S I O N S')
    const rows = this.data['division'].split('\r\n')
    const fields = rows.shift()

    this.log.divisions = { saved: 0, total: rows.length }

    for (var r of rows) {
      const cols = r.split(',')

      if (!cols[1]) return

      this.findOrCreate(Season, '_old', cols[1])
        .then(season => {

          const uid = cols[2] + ' ' + cols[3] + ' ' + this.leagueShort + ' ' + season.period
          const key = uid.toLowerCase().split(' ').join('-')
          this.findOrCreate(Division, 'key', key)
            .then(division => {
              division.key = key
              division.label = uid
              division._old = cols[0]
              division.season = season._id
              division.labelLocal = cols[2] + ' ' + cols[3]
              division.position = cols[3]
              division.title = (Number(cols[3])===0) ? 'Premier' : ''

              const ok = this.saveOrUpdate(division)
              if (ok) this.log.divisions.saved += 1
            })
        })
    }
  }

  async processClubs () {
    console.log('P R O C E S S     C L U B S')
    const rows = this.data['club'].split('\r\n')
    const fields = rows.shift()

    for (var r of rows) {
      const cols = r.split(',')

      if (!cols[1]) return

      this.findOrCreate(Venue, '_old', cols[3])
        .then(venue => {

        const uid = cols[1]
        const key = uid.toLowerCase().split(' ').join('-')
        this.findOrCreate(Club, 'key', key)
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

            this.saveOrUpdate(club)
          })
      })
    }
  }

  async processTeams () {
    console.log('P R O C E S S     T E A M S')
    const rows = this.data['team'].split('\r\n')
    const fields = rows.shift()

    for (var r of rows) {
      const cols = r.split(',')

      if (!cols[1]) return

      this.findOrCreate(Club, '_old', cols[3])
        .then(club => {

          this.findOrCreate(Division, '_old', cols[1])
            .then(division => {
              const teamName = (club.name + ' ' + cols[2]).trim()
              const uid = teamName + ' ' + division.label
              const key = uid.toLowerCase().split(' ').join('-')
              this.findOrCreate(Team, 'key', key)
                .then(team => {
                  team._old = cols[0]
                  team.key = key
                  team.label = uid
                  team.labelLocal = teamName
                  team.division = division._id
                  team.prefix = cols[2]
                  team.club = club._id

                  this.saveOrUpdate(team)
                })
            })
        })
    }
  }


  async processPlayers () {
    console.log('P R O C E S S     P L A Y E R S')
    const rows = this.data['player'].split('\r\n')
    const fields = rows.shift()

    for (var r of rows) {
      const cols = r.split(',')

      if (!cols[1]) return

      const uid = cols[1] + ' ' + cols[2]
      const key = uid.toLowerCase().split(' ').join('-')
      this.findOrCreate(Player, 'key', key)
        .then(player => {
          player.key = key
          player.firstName = cols[1]
          player.lastName = cols[2]
          player.name = cols[1] + ' ' + cols[2].toUpperCase()
          player._old = cols[0]
          player.gender = cols[3]

          this.saveOrUpdate(player)
        })
    }
  }



  async processMatches () {
    console.log('P R O C E S S     M A T C H E S')
    const rows = this.data['match'].split('\r\n')
    const fields = rows.shift()

    for (var r of rows) {
      const cols = r.split(',')

      if (!cols[1]) return

      const mths = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',')

      this.findOrCreate(Division, '_old', cols[1])
        .then(division => {

          this.findOrCreate(Venue, '_old', cols[2])
            .then(venue => {

              this.findOrCreate(Team, '_old', cols[4])
                .then(homeTeam => {

                  this.findOrCreate(Team, '_old', cols[5])
                    .then(awayTeam => {

                      const uid = homeTeam.labelLocal + ' vs ' + awayTeam.labelLocal + ' ' + String(division.key)
                      const key = uid.toLowerCase().split(' ').join('-')
                      this.findOrCreate(Match, 'key', key)
                        .then(match => {

                          let dt = cols[3]
                          dt = dt.split('.')
                          dt[1] = mths[Number(dt[1])-1]
                          dt = dt.join(' ')
                          match._old = cols[0]
                          match.key = key
                          match.division = division._id
                          match.venue = venue._id
                          match.homeTeam = homeTeam._id
                          match.awayTeam = awayTeam._id
                          match.startAt = new Date(dt)
                          match.label = homeTeam.labelLocal + ' vs ' + awayTeam.labelLocal

                          console.log('......................')
                          console.log('......................')
                          console.log('......................')
                          console.log('......................')
                          console.log('......................')
                          
                          console.log(division)
                          console.log(match)
                          this.saveOrUpdate(match)
                        })
                    })
                })
            })
        })


    }
  }



  async processVenues () {
    console.log('P R O C E S S     V E N U E S')
    const rows = this.data['venue'].split('\r\n')
    const fields = rows.shift()

    for (var r of rows) {
      const cols = r.split(',')

      if (!cols[1]) return

      const uid = cols[1]
      const key = cols[1].toLowerCase().split(' ').join('-')
      this.findOrCreate(Venue, 'key', key)
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

          console.log(venue)

          this.saveOrUpdate(venue)
        })
    }

  }
}

module.exports = ImportData;

