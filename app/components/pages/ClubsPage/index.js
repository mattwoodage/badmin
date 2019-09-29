import React, { useState, useEffect, useContext, Component } from 'react'
import { NavLink } from 'react-router-dom'

import Club from '../../Club'

import { Container, Row, Col } from 'react-grid-system';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'


function useData() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [clubs, setClubs] = useState([])
  const leagueContext = useContext(LeagueContext);

  useEffect(() => {
    
    async function initialise() {
      console.log('initialise')

      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      const response = await DB.get(`/api/${season.period}/clubs`)
      
      setClubs(response.clubs)
      setLoaded(true)
      leagueContext.stopLoad()

    }
    if (!loading) initialise()
  });

  return [clubs, loaded]
}


function ClubsPage(props) {

  const leagueContext = useContext(LeagueContext);
  const [clubs, loaded] = useData()

  if (!loaded) return <div>Loading...</div>

  return (
    <div>
      <h1>CLUBS</h1>
      <NavLink className='button' to="./club/new">CREATE NEW CLUB</NavLink>
      <div>
      {
        clubs.map(club => {
          return (
            <Club key={club.key} club={club} onSelect={() => leagueContext.selectClub(club)} />
          )
        })
      }
      </div>
    </div>
  )

}

export default ClubsPage

