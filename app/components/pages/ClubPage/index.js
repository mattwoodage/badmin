import React, { useContext, useState, useEffect } from 'react'
import Club from '../../Club'

import Panel from '../../Panel'
import Notification from '../../Notification'
import Breadcrumb from '../../Breadcrumb'

import ClubForm from '../../ClubForm'
import TeamForm from '../../TeamForm'

import Button from '@material-ui/core/Button';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

function useData(props) {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [venues, setVenues] = useState([])
  const [divisions, setDivisions] = useState([])
  const [club, setClub] = useState({})
  const [teams, setTeams] = useState([])
  const leagueContext = useContext(LeagueContext);

  const { match } = props
  const clubID = match.params.club


  useEffect(() => {
    
    async function initialise() {

      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      let response = await DB.get(`/api/${season.period}/venues`)
      setVenues(response.venues)
      
      response = await DB.get(`/api/${season.period}/divisions`)
      setDivisions(response.divisions)

      if (clubID !== 'new') {
        response = await DB.get(`/api/${season.period}/club/${clubID}`)
        let teamsArray = response.teams
        teamsArray.push({club: response.club._id})
        setClub(response.club)
        setTeams(teamsArray)
      }

      setLoaded(true)
      leagueContext.stopLoad()
    }
    if (!loading) initialise()
  });

  return [venues, divisions, club, teams, loaded]
}



function ClubPage(props) {

  const leagueContext = useContext(LeagueContext);
  const { season } = leagueContext
  const [venues, divisions, club, teams, loaded] = useData(props)

  if (!loaded) return <div>Loading...</div>

  return (
    <div>

      <Breadcrumb list={
        [
          {lbl:'CLUBS', url:'../clubs'},
          {lbl: (club && club.name && club.name.toUpperCase()) || 'NEW CLUB'}
        ]
      } />

      <Panel high marginBottom>  
        <ClubForm season={season} originalClub={club} venues={venues} />
      </Panel>

      <h1>Teams this season</h1>
      
      {teams.map(team => (
        <TeamForm originalTeam={team} divisions={divisions}  />
      ))}
    </div>
  )

}

export default ClubPage

