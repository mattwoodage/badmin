'use strict';
var express = require('express');
var kraken = require('kraken-js');
var path = require('path');


var League = require('./app/models/League')
var Season = require('./app/models/Season')
var Division = require('./app/models/Division')
var Team = require('./app/models/Team')
var Match = require('./app/models/Match')
var Club = require('./app/models/Club')
var Venue = require('./app/models/Venue')
var Format = require('./app/models/Format')


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

global.kraken = app.kraken;
app.use(kraken(options));
app.on('start', function () {
  global.log.info('Application ready to serve requests.');
  global.log.info('Environment: %s', app.kraken.get('env:env'));
});

// LEAGUES

router.get('/api/leagues', (req, res, next) => {
  League.find({}).sort({ createdAt: -1 }).exec((err, leagues) => {
    if (err) return next(err)
    res.json(leagues)
  })
})

router.get('/api/league/:short/:seasonPeriod', (req, res, next) => {
  League.findOne({ short: req.params.short.toUpperCase() }).exec((err, league) => {
    if (err || !league) return res.json({league: null, season: null})
    Season.findOne({ league: league._id, period: req.params.seasonPeriod }, (err, season) => {
      if (err || !season) return res.json({league: league, season: null})
      res.json({league: league, season: season})
    })
  })
})

router.get('/api/league/import/:short', (req, res, next) => {
  new ImportData(req, res)
})

router.get('/api/league/:leagueID', (req, res) => {
  res.json(req.params.league)
})

// DIVISIONS

router.get('/api/league/:short/:seasonPeriod/divisions', (req, res, next) => {
  League.findOne({ short: req.params.short.toUpperCase() }).exec((err, league) => {
    if (err || !league) return res.json({divisions: null})
    Season.findOne({ league: league._id, period: req.params.seasonPeriod }, (err, season) => {
      if (err || !season) return res.json({divisions: null})
      Division.find({ season: season._id }, (err, divisions) => {
        if (err) return res.json({divisions: null})
        res.json({divisions: divisions})
      })
    })
  })
})

// MATCHES

router.get('/api/league/:short/:seasonPeriod/matches', (req, res, next) => {
  League.findOne({ short: req.params.short.toUpperCase() }).exec((err, league) => {
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
        .populate({ path: 'homeTeam', model: Team })
        .populate({ path: 'awayTeam', model: Team })
        .populate({ path: 'division', model: Division })
        .sort({ startAt: 1 })
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