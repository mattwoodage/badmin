
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

import fs from 'fs'


class UpdateAll {

  constructor(req, res) {

    const leagueShort = req.headers.host.split('.')[0].toUpperCase()

    console.log('UPDATE ALL DATA FOR ', leagueShort)

    this.res = res
    this.teams = []
    this.leagueShort = leagueShort
    this.seasonPeriod = req.params.seasonPeriod
    this.data = {}
    this.log = {}

    this.processTables()
    //this.processPlayerStats()         T O    D O 
  }

  

  async processTables () {
    console.log('****** P R O C E S S    T A B L E S ******')

    console.log('>>>>>', League)

    
    const league = await League.findOne({ short: this.leagueShort })

    const season = await Season.findOne({ league: league._id, period: this.seasonPeriod })

    const divisions = await Division.find({ season: season._id })

    for (let index = 0; index < divisions.length; index++) {
      //if (index>0) return this.res.json({cutshort:true})
      await this.processDivision(divisions[index])
    }

    return this.res.json({ok:true})
  }

  async processDivision (division) {
    
    const teams = await Team.find({division: division._id})

    const matches = await Match.find({division: division._id })

    teams.forEach(t => {
      t.matchesWon = 0
      t.matchesFull = 0
      t.matchesLost = 0
      t.matchesDrawn = 0
      t.matchesTotal = 0
      t.rubbersWon = 0
      t.rubbersLost = 0
      t.rubbersDrawn = 0
      t.gamesWon = 0
      t.gamesLost = 0
      t.pointsWon = 0
      t.pointsLost = 0
      t.pos = 0
      t.pts = 0
    })

    for (let index = 0; index < matches.length; index++) {
     
      const match = matches[index]
      const homeTeam = this.getTeam(match.homeTeam, teams)
      const awayTeam = this.getTeam(match.awayTeam, teams)

      await this.processMatch(match, division, homeTeam, awayTeam)
    }

  }

  async processMatch (match, division, homeTeam, awayTeam) {

    console.log('process match', match)

    // only get the confirmed score card!  status = 1
    const scoreCard = await ScoreCard.findOne({match: match._id, status: 1})

    if (scoreCard) {
      homeTeam.matchesTotal += 1
      awayTeam.matchesTotal += 1

      let homePts = 0
      let awayPts = 0

      //check attendance
      

      console.log(division.numPlayers, scoreCard.homePlayers.length, scoreCard.awayPlayers.length)
      if (division.numPlayers == scoreCard.homePlayers.length) {
        homeTeam.matchesFull += 1
        homePts += division.ptsFullTeam
      }
      if (division.numPlayers == scoreCard.awayPlayers.length) {
        awayTeam.matchesFull += 1
        awayPts += division.ptsFullTeam
      }

      // LOOP THROUGH RUBBERS

      let homeRubbersWon = 0
      let homeRubbersDrawn = 0
      let homeRubbersLost = 0

      let awayRubbersWon = 0
      let awayRubbersDrawn = 0
      let awayRubbersLost = 0

      let totalHomePoints = 0
      let totalAwayPoints = 0
      let totalHomeGames = 0
      let totalAwayGames = 0

      for (let rubberNum = 1; rubberNum <= division.numRubbers; rubberNum++) {

        let homeGames = 0
        let awayGames = 0

        let homePoints = 0
        let awayPoints = 0

        // LOOP THROUGH THE GAMES
        for (let gameNum = 1; gameNum <= division.numGamesPerRubber; gameNum++) {

          const scores = await Score.find({scoreCard: scoreCard._id, gameNum: gameNum, rubberNum: rubberNum })
          
          scores.forEach(score => {
            if (score.win) {
              if (score.isHomeTeam) {
                homeGames += 1
                homePoints += score.points
              }
              else {
                awayGames += 1
                awayPoints += score.points
              }
            }
          })
        }

        homeTeam.pointsWon += homePoints
        awayTeam.pointsWon += awayPoints
        homeTeam.pointsLost += awayPoints
        awayTeam.pointsLost += homePoints

        homeTeam.gamesWon += homeGames
        awayTeam.gamesWon += awayGames
        homeTeam.gamesLost += awayGames
        awayTeam.gamesLost += homeGames

        if (homeGames > awayGames) {
          homeRubbersWon += 1
          awayRubbersLost += 1
        }
        if (homeGames === awayGames) {
          homeRubbersDrawn += 1
          awayRubbersDrawn += 1
        }
        if (homeGames < awayGames) {
          homeRubbersLost += 1
          awayRubbersWon += 1
        }

        totalHomePoints += homePoints
        totalAwayPoints += awayPoints
        totalHomeGames += homeGames
        totalAwayGames += awayGames

        console.log('r:',rubberNum, 'h:',homeGames, 'a:', awayGames, homeRubbersWon, awayRubbersWon)
      }

      homeTeam.rubbersWon += homeRubbersWon
      homeTeam.rubbersDrawn += homeRubbersDrawn
      homeTeam.rubbersLost += homeRubbersLost

      awayTeam.rubbersWon += awayRubbersWon
      awayTeam.rubbersDrawn += awayRubbersDrawn
      awayTeam.rubbersLost += awayRubbersLost

      if (homeRubbersWon > awayRubbersWon) {
        homeTeam.matchesWon += 1
        awayTeam.matchesLost += 1
      }
      if (homeRubbersWon === awayRubbersWon) {
        homeTeam.matchesDrawn += 1
        awayTeam.matchesDrawn += 1
      }
      if (homeRubbersWon < awayRubbersWon) {
        homeTeam.matchesLost += 1
        awayTeam.matchesWon += 1
      }

      // PTS
      
      if (homeRubbersWon === awayRubbersWon) {
        //candraw
        if (division.canDraw) {
          // both teams draw on rubbers
          homePts += division.ptsDraw
          awayPts += division.ptsDraw
          scoreCard.winner = 2
        }
        else {
          // check games
          if (totalHomeGames > totalAwayGames) {
            homePts += division.ptsWinBy1
            awayPts += division.ptsLoseBy1
            scoreCard.winner = 1
          }
          else if (totalAwayGames > totalHomeGames) {
            homePts += division.ptsLoseBy1
            awayPts += division.ptsWinBy1
            scoreCard.winner = 3
          }
          else {
            if (totalHomePoints > totalAwayPoints) {
              homePts += division.ptsWinBy1
              awayPts += division.ptsLoseBy1
              scoreCard.winner = 1
            }
            else if (totalAwayPoints > totalHomePoints) {
              homePts += division.ptsLoseBy1
              awayPts += division.ptsWinBy1
              scoreCard.winner = 3
            }
            else {
              // this shouldn't happen - no rules for this situation!
              homePts += division.ptsWinBy1
              awayPts += division.ptsWinBy1
              scoreCard.winner = 2
            }
          }
        }
      }
      else if (homeRubbersWon-1 > awayRubbersWon) {
        homePts += division.ptsWinBy2
        awayPts += division.ptsLoseBy2
        scoreCard.winner = 1
      }
      else if (homeRubbersWon > awayRubbersWon) {
        homePts += division.ptsWinBy1
        awayPts += division.ptsLoseBy1
        scoreCard.winner = 1
      }
      else if (awayRubbersWon-1 > homeRubbersWon) {
        awayPts += division.ptsWinBy2
        homePts += division.ptsLoseBy2
        scoreCard.winner = 3
      }
      else if (awayRubbersWon > homeRubbersWon) {
        awayPts += division.ptsWinBy1
        homePts += division.ptsLoseBy1
        scoreCard.winner = 3
      }
     
      homeTeam.pts += homePts
      awayTeam.pts += awayPts

      scoreCard.homePoints = totalHomePoints
      scoreCard.awayPoints = totalAwayPoints
      scoreCard.homeGames = totalHomeGames
      scoreCard.awayGames = totalAwayGames
      scoreCard.homeRubbers = homeRubbersWon
      scoreCard.awayRubbers = awayRubbersWon
      scoreCard.homePts = homePts
      scoreCard.awayPts = awayPts

      await homeTeam.save()
      await awayTeam.save()
      await scoreCard.save()

      // is this required?
      match.scoreCard = scoreCard._id
      await match.save()
    }
  }


  getTeam(id, teams) {
    const matched = teams.find(t => {
      return t._id.equals(id)
    })
    return matched
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
        console.log('SAVED ', obj)
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

  newLog (rows) {
    return { saved: 0, processed: 0, total: rows.length-1, errors: [] }
  }

  
}

export default UpdateAll;

