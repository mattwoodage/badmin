'use strict';
var express = require('express');
var kraken = require('kraken-js');
var path = require('path');


var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('./config/settings');
require('./config/passport')(passport);
var jwt = require('jsonwebtoken');

var User = require("./app/models/User");

var League = require('./app/models/League')
var Season = require('./app/models/Season')
var Division = require('./app/models/Division')
var Team = require('./app/models/Team')
var Match = require('./app/models/Match')
var Club = require('./app/models/Club')
var Venue = require('./app/models/Venue')
var Player = require('./app/models/Player')
var ScoreCard = require('./app/models/ScoreCard')
var Score = require('./app/models/Score')

var ImportData = require('./import/ImportData')

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

  if (!req.body.nickname) {
    res.status(401).send({success: false, field: 'nickname', msg: 'Please enter a nickname'});
  } else if (!req.body.email) {
    res.status(401).send({success: false, field: 'email', msg: 'Please enter a valid email address'});
  } else if (!req.body.password || req.body.password.length < 6) {
    res.status(401).send({success: false, field: 'password', msg: 'Please enter a password (6 chars or more)'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname
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

      seasons = seasons.map((s) => {
        return s.period
      })

      res.json({league: league, season: season, seasons: seasons})
    })
  })
})

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
          $sort: { labelLocal: 1 }
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

router.get('/api/:seasonPeriod/clubs', (req, res, next) => {
  Club.aggregate([
    {
        $lookup: {
           from: "members",
           localField: "_id",
           foreignField: "club",
           as: "members"
        }
    }
  ], (err, clubs) => {
    if (err) return res.json({clubs: null})
    res.json({clubs: clubs})
  })
  .sort({ name: 1 })
})


// PLAYERS

router.get('/api/:seasonPeriod/players', (req, res, next) => {
  Player.find({}, (err, players) => {
    if (err) return res.json({players: null})
    res.json({players: players})
  })
  .sort({ lastName: 1 })
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
          console.log(score, score.players.length)
          cards[score.scoreCard].scores.push(score)
        })
        res.json({match: match, cards:cards})
      })
      .populate({ path: 'players', model: Player })

      .sort({ rubberNum: 1, gameNum: 1, isHomeTeam: -1 })
      
    })
    .populate({ path: 'confirmedBy', model: User })
    .populate({ path: 'enteredBy', model: User })
  })
  .populate({ path: 'awayTeam', model: Team })
  .populate({ path: 'homeTeam', model: Team })
  .populate({ path: 'division', model: Division })
  .populate({ path: 'venue', model: Venue })
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