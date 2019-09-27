import React, { useContext } from 'react'
import PlayerSearch from '../../PlayerSearch'
import { LeagueContext } from '../../Root'


function PlayersPage() {

  const leagueContext = useContext(LeagueContext);
  const { league, season } = leagueContext

  return (
    <div>
      <h1>PLAYERS</h1>
      <PlayerSearch league={league} season={season} />
    </div>
  )

}

export default PlayersPage

