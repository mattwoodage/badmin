const DB = {}

DB.get = (query) => {
  console.log('DB.get FETCH:', query)
  return new Promise((resolve, reject) => {
    fetch(query, {
      method: 'get'
    })
    .then(response => {
      const json = response.json()
      console.log('DB.get RESPONSE:', response.status)
      resolve(json)
    })
    .catch(error => {
      console.error('DB.get ERROR:', error)
      reject(error)
    })
  })
}

export default DB



  // LOADER LOADER LOADER LOADER
  

  // const host = req.headers.host
  // const short = host.split('.')[0].toUpperCase()
  // const seasonPeriod = match.params.season

  // console.log('----------------------------------------')
  // console.log(host, seasonPeriod)

  // var league = await League.findOne({ short: short }, (err, res) => {
  //   if (err) return console.error(err)
  //   return res
  // })

  // var season = await Season.findOne({ league: league._id, period: seasonPeriod }, (err, res) => {
  //   if (err) return console.error(err)
  //   return res
  // })

  // var divisions = await Division.find({ season: season._id }, (err, res) => {
  //   if (err) return console.error(err)
  //   return res
  // }).populate({ path: 'teams', model: Team })

  // const divisionsArray = divisions.map((d) => {
  //   return d._id
  // })

  // var teams = await Team.find({division: { $in: divisionsArray }})
  //   .populate({ path: 'club', model: Club })
  //   .sort({ label: 1 })

  // var matches = await Match.find({division: { $in: divisionsArray }})
  //   .populate({ path: 'homeTeam', model: Team })
  //   .populate({ path: 'awayTeam', model: Team })
  //   .populate({ path: 'venue', model: Venue })
  //   .sort({ startAt: 1 })

  // await Promise.all(divisions.map(async (division) => {
  //   division.matches = await Match.find({ division: division._id }, (err, res) => {
  //     if (err) return console.error(err)
  //     return res
  //   })
  // }))

  // let clubs = teams.reduce((x, y) => x.map((d) => {
  //   return d._id
  // }).includes(y.club._id) ? x : [...x, y.club], [])

  // const ret = { league: league, season: season, divisions: divisions, clubs: clubs, teams: teams, matches: matches }
  // return ret

