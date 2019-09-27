import React, { useState, useEffect, useContext } from 'react'

import { LeagueContext } from '../../Root'
import SeasonForm from '../../SeasonForm'


function useData() {

  const [loaded, setLoaded] = useState(false)
  const [seasons, setSeasons] = useState([])
  const leagueContext = useContext(LeagueContext);

  useEffect(() => {
    const { seasons } = leagueContext;
    if (seasons && seasons.length && !loaded) {
      let seasonsArray = seasons.slice(0)
      seasonsArray.push({})
      setSeasons(seasonsArray)
      setLoaded(true)
    }
  });

  return [seasons, loaded]
}


function SeasonsPage() {

  const [seasons, loaded] = useData()

  return (
    <div>
      <h1>SEASONS</h1>
    
      {seasons.map((s) => {
      return <SeasonForm season={s} />
      })}

    </div>
  )

}

export default SeasonsPage


