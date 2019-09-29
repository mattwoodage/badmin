import React, { useContext, useState, useEffect } from 'react'

import { BrowserRouter } from 'react-router-dom'

import Breadcrumb from '../../Breadcrumb'
import FixtureForm from '../../FixtureForm'

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

function useData() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [venues, setVenues] = useState([])
  
  const leagueContext = useContext(LeagueContext);

  useEffect(() => {
    
    async function initialise() {
      
      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      let response = await DB.get(`/api/${season.period}/venues`)
      setVenues(response.venues)
      
      setLoaded(true)
      leagueContext.stopLoad()
    }
    if (!loading) initialise()
  });

  return [venues, loaded]
}

function FixturePage() {

  const leagueContext = useContext(LeagueContext);
  
  if (!leagueContext.fixture) return (<BrowserRouter location="/../fixtures"/>)

  const { division, homeTeam, awayTeam } = leagueContext.fixture

  const [venues, loaded] = useData()

  if (!loaded) return <div>Loading...</div>

  return (
    <div>

      <Breadcrumb list={
        [
          {lbl:'FIXTURES', url:'../fixtures'},
          {lbl:'NEW'}
        ]
      } />

      <FixtureForm venues={venues} division={division} homeTeam={homeTeam} awayTeam={awayTeam} />
    </div>
  )

}

export default FixturePage
