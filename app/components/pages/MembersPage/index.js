import React, { useContext, useState, useEffect } from 'react'

import Player from '../../Player'

import Panel from '../../Panel'
import Breadcrumb from '../../Breadcrumb'
import { NavLink } from 'react-router-dom'

import PlayerSearch from '../../PlayerSearch'

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'



function useData(props) {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [club, setClub] = useState({})
  const [members, setMembers] = useState([])

  const leagueContext = useContext(LeagueContext);

  const { match } = props
  const clubID = match.params.club

  useEffect(() => {
    
    async function initialise() {

      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      const clubResponse = await DB.get(`/api/${season.period}/club/${clubID}`)
      setClub(clubResponse.club)
        
      const membersResponse = await DB.get(`/api/${season.period}/members/${clubID}`)
      setMembers(membersResponse.members)

      setLoaded(true)
      leagueContext.stopLoad()

    }
    if (!loading) initialise()
  });

  return [club, members, loaded]
}


function MembersPage(props) {

  const leagueContext = useContext(LeagueContext);
  const { league, season } = leagueContext

  const [club, members, loaded] = useData(props)

  if (!loaded) return <div>Loading...</div>

  return (
    <div>
      <Breadcrumb list={
        [
          {lbl:'CLUBS', url:'../../clubs'},
          {lbl:club.name.toUpperCase(), url: `../../club/${club._id}`},
          {lbl:'MEMBERS'}
        ]
      } />

      {members.map(m => <b>{m.player.name}</b>)}

      <hr />

      <h1>SEARCH PLAYERS</h1>
      <PlayerSearch league={league} season={season} />
      
    </div>
  )

}

export default MembersPage
