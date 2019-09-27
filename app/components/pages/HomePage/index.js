import React, { useContext } from 'react'

import { LeagueContext } from '../../Root'
import Panel from '../../Panel'

function HomePage() {

  const leagueContext = useContext(LeagueContext);

  return (
      <h1>{leagueContext.league ? leagueContext.league.name : ''}</h1>
  )

}

export default HomePage



