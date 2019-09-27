import React, { useContext, useState, useEffect } from 'react'

import DivisionGrid from '../../DivisionGrid'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'


function useData() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [divisions, setDivisions] = useState([])
  const [matches, setMatches] = useState([])  
  const leagueContext = useContext(LeagueContext);

  useEffect(() => {
    
    async function initialise() {
      console.log('initialise')

      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      const divisionsResponse = await DB.get(`/api/${season.period}/divisions`)
      const matchesResponse = await DB.get(`/api/${season.period}/matches`)

      setDivisions(divisionsResponse.divisions)
      setMatches(matchesResponse.matches)
      setLoaded(true)
      leagueContext.stopLoad()

    }
    if (!loading) initialise()
  });

  return [divisions, matches, loaded]
}


function ResultsPage() {

  const [divisions, matches, loaded] = useData()

  console.log('--', divisions, matches, loaded)


  const matchesInDivision = (division) => {
    return matches.filter(match => {
      return match.division._id === division._id
    })
  }

  const renderGrids = () => {
    return (
      <div>
      {
        divisions.map(division => {
          return (
            <DivisionGrid key={division.key} matches={matchesInDivision(division)} division={division} />
          )
        })
      }
      </div>
    )
  }

  if (!loaded) return <div>Loading...</div>

  return (
    <div>
      <h1>RESULTS</h1>
      {renderGrids()}
    </div>
  )

}

export default ResultsPage
