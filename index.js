'use strict';
var express = require('express');
var kraken = require('kraken-js');
var path = require('path');


var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('./config/settings');
require('./config/passport')(passport);
var jwt = require('jsonwebtoken');

import to from 'await-to-js';

import User from './app/models/User'

import League from './app/models/League'
import Season from './app/models/Season'
import Division from './app/models/Division'
import Team from './app/models/Team'
import Match from'./app/models/Match'
import Club from './app/models/Club'
import Venue from './app/models/Venue'
import Player from './app/models/Player'
import ScoreCard from './app/models/ScoreCard'
import Score from './app/models/Score'
import Member from './app/models/Member'

import ImportData from './app/services/ImportData'
import UpdateAll from './app/services/UpdateAll'

var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
  onconfig: function (config, next) {
    /*
     * Add any additional config setup or overrides here. `config` is an initialized
     * `confit` (https://github.com/krakenjs/confit/) configuration object.
     */

    next(null, config);
  }
};

app = module.exports = express();

const router = express.Router()

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

global.log = require('./app/lib/logger');
global.appRoot = path.resolve(__dirname);

app.use(express.json())

global.kraken = app.kraken;
app.use(kraken(options));
app.on('start', function () {
  global.log.info('Application ready to serve requests.');
  global.log.info('Environment: %s', app.kraken.get('env:env'));
});


function getToken (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};



// I M P O R T 

router.get('/api/league/import/:short', (req, res, next) => {
  req.setTimeout(6000000)
  new ImportData(req, res)
})


// U P D A T E - A L L

router.get('/api/league/update/:short/:seasonPeriod', (req, res, next) => {
  req.setTimeout(6000000)
  new UpdateAll(req, res)
})


// A U T H 



router.post('/api/auth/login', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, field: 'email', msg: 'Email not found'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), settings.secret);
          // return the information including token as JSON
          res.json({success: true, nickname: user.nickname, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, field: 'password', msg: 'Wrong password'});
        }
      });
    }
  });
});

router.post('/api/auth/register', (req, res) => {

  if (!req.body.firstName) {
    res.status(401).send({success: false, field: 'firstName', msg: 'Please enter a first name'});
  } else if (!req.body.lastName) {
    res.status(401).send({success: false, field: 'lastName', msg: 'Please enter a last name'});
  } else if (!req.body.nickname) {
    res.status(401).send({success: false, field: 'nickname', msg: 'Please enter a nickname'});
  } else if (!req.body.email) {
    res.status(401).send({success: false, field: 'email', msg: 'Please enter a valid email address'});
  } else if (!req.body.password || req.body.password.length < 6) {
    res.status(401).send({success: false, field: 'password', msg: 'Please enter a password (6 chars or more)'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        console.log(err)
        return res.status(401).send({success: false, field: 'email', msg: 'Sorry this email already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});




// LEAGUES


router.get('/api/leagues', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    League.find({}).sort({ createdAt: -1 }).exec((err, leagues) => {
      if (err) return next(err)
      res.json(leagues)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
})

router.get('/api/:seasonPeriod/seasons', (req, res, next) => {

  const leagueShort = req.headers.host.split('.')[0].toUpperCase()

  League.findOne({ short: leagueShort }).exec((err, league) => {
    if (err || !league) return res.json({league: null, season: null})
    Season.find({ league: league._id }, (err, seasons) => {
      if (err || !seasons) return res.json({league: league, seasons: []})

      const season = seasons.find((s) => {
        if (s.period === req.params.seasonPeriod) return s
      })

      res.json({league: league, season: season, seasons: seasons})
    })
    .sort({ startYear: 1 })
  })
})



// SEASON POST

router.post('/api/season', async function(req, res) {

  const leagueShort = req.headers.host.split('.')[0].toUpperCase()
  const getLeague = League.findOne({ short: leagueShort })  
  const [ leagueErr, league ] = await to(getLeague)


  if (req.body._id) {
    // edit

    Season.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { new: true }
    ).exec((err, _season) => {
      if (err) return res.json({a:1,error: err})
      _season.save((err, _season) => {
        if (err) return res.json({b:1,error: err})
        res.status(200);
        res.json({season:_season});
      })
    })

  } else {
    // create
    const season = new Season({...req.body, league: league._id});
    season.save((err, _season) => {
      if (err) return res.json({error: err})
      res.status(201);
      res.json(_season);
    });
  }

});


// SEASON POST

router.post('/api/division', function(req, res) {

  if (req.body._id) {
    // edit

    Division.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { new: true }
    ).exec((err, _division) => {
      if (err) return res.json({error: err})
      _division.save((err, _division) => {
        if (err) return res.json({error: err})
        res.status(200);
        res.json({division:_division});
      })
     }
    )

  } else {
    // create
    const division = new Division(req.body);
    division.save((err, _division) => {
      if (err) return res.json({error: err})
      res.status(201);
      res.json(_division);
    });
  }

});


router.get('/api/import-all', (req, res, next) => {
  new ImportData(req, res)
})


// DIVISIONS

router.get('/api/:seasonPeriod/divisions', (req, res, next) => {
  
  const leagueShort = req.headers.host.split('.')[0].toUpperCase()

  League.findOne({ short: leagueShort }).exec((err, league) => {
    if (err || !league) return res.json({divisions: null})
    Season.findOne({ league: league._id, period: req.params.seasonPeriod }, (err, season) => {
      if (err || !season) return res.json({divisions: null})
      
      Division.aggregate([
      {
          $match: { season: season._id }
      },
      {
          $sort: { category: 1, position: 1 }
      },
      {
          $lookup: {
             from: "teams",
             localField: "_id",
             foreignField: "division",
             as: "teams"
          }
      }
      ], (err, divisions) => {
        if (err) return res.json({divisions: null})
        res.json({divisions: divisions})
      })
    })
  })
})

// CLUBS

// GET LIST
router.get('/api/:seasonPeriod/clubs', async (req, res, next) => {

  const leagueShort = req.headers.host.split('.')[0].toUpperCase()

  const venues = await Venue.find({})

  League.findOne({ short: leagueShort }).exec((err, league) => {
    if (err || !league) return res.json({clubs: null})

    Season.findOne({ league: league._id, period: req.params.seasonPeriod }, (err, season) => {
      if (err || !season) return res.json({clubs: null})

      Division.find({ season: season._id }, (err, divisions) => {
        if (err) return res.json({club: null})
        const divisionsArray = divisions.map((d) => {
          return d._id.toString()
        })

        Club.aggregate([
          {
            $lookup: {
               from: "teams",
               localField: "_id",
               foreignField: "club",
               as: "teams"
            }
          },
          {
            $sort: {
              name: 1
            }
          }
        ], (err, clubs) => {
          if (err) return res.json({error: err})

          clubs.forEach(c => {

            c.teams = c.teams.filter(t => {
              return divisionsArray.indexOf(t.division.toString()) != -1
            })

            c.teams.forEach(t => {
              t.division = divisions.find(d => d._id.equals(t.division))
            })

            c.teams.sort((a,b) => a.prefix < b.prefix ? 1 : -1)

            c.clubnightVenue = venues.find(v => v._id.equals(c.clubnightVenue))
            c.matchVenue = venues.find(v => v._id.equals(c.matchVenue))

            c.matchAltVenue = venues.find(v => v._id.equals(c.matchAltVenue))
            c.clubnightAltVenue = venues.find(v => v._id.equals(c.clubnightAltVenue))
            
          })

          // clubs = clubs.filter(c => c.teams.length > 0)

          res.json({clubs: clubs})
        })
        .sort({ name: 1 })
      })
    })
  })
})

// CLUB POST

router.post('/api/:seasonPeriod/club', function(req, res) {

  if (req.body._id) {
    // edit

    Club.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { new: true }
    ).exec((err, _club) => {
      if (err) return res.json({error: err})
      res.status(200);
      res.json({club:_club});
    })

  } else {
    // create
    const club = new Club(req.body);
    club.save((err, _club) => {
      if (err) return res.json({error: err})
      res.status(201);
      res.json(_club);
    });
  }

});



// TEAM POST

router.post('/api/team', function(req, res) {

  console.log('TEAM POST')
    
  Team.find({}, (err, teams) => {
    teams.forEach(t => {
      t.save()
    })
  })

  if (req.body._id) {
    // edit

    Team.findOne({_id: req.body._id}, (err, team) => {
      team.save(req.body, (err, _team) => {
        if (err) return res.json({error: err})
        res.status(200);
        res.json({team:_team});
      })
    })

  } else {
    // create
    const team = new Team(req.body);

    team.save((err, _team) => {
      if (err) return res.json({error: err})
      res.status(201);
      res.json(_team);
    });
  }

});


// PLAYERS

router.get('/api/:seasonPeriod/players', (req, res, next) => {
  Player.find({}, (err, players) => {
    if (err) return res.json({players: null})
    res.json({players: players})
  })
  .sort({ lastName: 1 })
})


// MEMBERS FOR MATCH

router.get('/api/:seasonPeriod/members/:home/:away', async (req, res, next) => {
  const same = req.params.home === req.params.away
  const doNothing = Promise.resolve()

  const getHome = Club.findOne({_id: req.params.home})
  const getAway = same ? doNothing : Club.findOne({_id: req.params.away})

  const [ homeErr, homeClub ] = await to(getHome)
  const [ awayErr, awayClub ] = await to(getAway)

  if (homeErr || awayErr) return res.json({home: [], away: []})

  const getHomeMembers = Member.find({ club: homeClub._id }).populate({ path: 'player', model: Player })
  const getAwayMembers = same ? doNothing : Member.find({ club: awayClub._id }).populate({ path: 'player', model: Player })

  const [ homeMembersErr, homeMembers ] = await to(getHomeMembers)
  const [ awayMembersErr, awayMembers ] = await to(getAwayMembers)

  return res.json({home: homeMembers || [], away: same ? homeMembers : (awayMembers || [])})

})


// VENUES

router.get('/api/:seasonPeriod/venues', (req, res, next) => {
  Venue.find({}, (err, venues) => {
    if (err) return res.json({venues: null})
    res.json({venues: venues})
  })
  .sort({ name: 1 })
})


// MATCHES

router.get('/api/:seasonPeriod/matches', (req, res, next) => {

  const leagueShort = req.headers.host.split('.')[0].toUpperCase()

  League.findOne({ short: leagueShort }).exec((err, league) => {
    if (err || !league) return res.json({matches: null})
    Season.findOne({ league: league._id, period: req.params.seasonPeriod }, (err, season) => {
      if (err || !season) return res.json({matches: null})
      Division.find({ season: season._id }, (err, divisions) => {
        if (err) return res.json({matches: null})
        const divisionsArray = divisions.map((d) => {
          return d._id
        })
        Match.find({division: { $in: divisionsArray }}, (err, matches) => {
          if (err) return res.json({matches: null})
          res.json({matches: matches})
        })
        .populate({ path: 'scoreCard', model: ScoreCard })
        .populate({ path: 'division', model: Division })
        .populate({ path: 'venue', model: Venue })
        .sort({ startAt: 1 })
      })
    })
  })
})


// MATCH

router.get('/api/:seasonPeriod/match/:match', (req, res, next) => {

  const leagueShort = req.headers.host.split('.')[0].toUpperCase()

  Match.findOne({_id: req.params.match}, (err, match) => {
    if (err) return res.json({match: null})

    ScoreCard.find({ match: match._id }, (err, scoreCards) => {
      if (err) return res.json({match: match, e:1})
      const cards = {}
      const cardsArray = scoreCards.map((c) => {

        cards[c._id] = c
        cards[c._id].scores = []
        return c._id
      })
      Score.find({scoreCard: { $in: cardsArray }}, (err, scores) => {
        if (err) return res.json({match: match, e:2})
        scores.map((score) => {
          cards[score.scoreCard].scores.push(score)
        })
        res.json({match: match, cards:cards})
      })
      .sort({ rubberNum: 1, gameNum: 1, isHomeTeam: -1 })
      .populate({ path: 'players', model: Player })
    })
    .populate({ path: 'confirmedBy', model: User })
    .populate({ path: 'enteredBy', model: User })
    .populate({ path: 'homePlayers', model: Player })
    .populate({ path: 'awayPlayers', model: Player })
  })
  .populate({ path: 'awayTeam', model: Team })
  .populate({ path: 'homeTeam', model: Team })
  .populate({ path: 'division', model: Division })
  .populate({ path: 'venue', model: Venue })
})





// CLUB

router.get('/api/:seasonPeriod/club/:club', (req, res, next) => {

  const leagueShort = req.headers.host.split('.')[0].toUpperCase()

  Club.findOne({_id: req.params.club}, (err, club) => {
    if (err) return res.json({club: null})

    League.findOne({ short: leagueShort }).exec((err, league) => {
      if (err || !league) return res.json({club: null})

      Season.findOne({ league: league._id, period: req.params.seasonPeriod }, (err, season) => {
        if (err || !season) return res.json({club: null})

        Division.find({ season: season._id }, (err, divisions) => {
          if (err) return res.json({club: null})
          const divisionsArray = divisions.map((d) => {
            return d._id
          })

          Team.find({ club: club._id, division: { $in: divisionsArray } }, (err, teams) => {
            if (err) return res.json({club: club, e:1})
           
            res.json({club: club, teams:teams})

          })
        })
      })
    })
  })
})



// // router.post('/', (req, res) => {
// //   const question = new Question(req.body);
// //   question.save((err, question) => {
// //     if (err) return next(err);
// //     res.status(201);
// //     res.json(question);
// //   });
// // });



app.use(router)

app.use('/*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});