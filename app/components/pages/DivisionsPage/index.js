import React, { useState, useContext, useEffect } from 'react'

import { LeagueContext } from '../../Root'

import DB from '../../../helpers/DB'

import DivisionForm from '../../DivisionForm'
import Breadcrumb from '../../Breadcrumb'



function useData() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [divisions, setDivisions] = useState([])
  const leagueContext = useContext(LeagueContext);

  useEffect(() => {
    
    async function initialise() {

      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      const response = await DB.get(`/api/${season.period}/divisions`)
      
      const divisionsArray = response.divisions
      divisionsArray.push({ season: season._id })

      setDivisions(divisionsArray)
      setLoaded(true)
      leagueContext.stopLoad()

    }
    if (!loading) initialise()
  });

  return [divisions, loaded]
}

function DivisionsPage(props) {

  const leagueContext = useContext(LeagueContext);
  const { season } = leagueContext
  const [divisions, loaded] = useData()

  if (!loaded) return <div>Loading...</div>

  return (
    <div>
      <Breadcrumb list={
        [
          {lbl:'SEASONS', url:'./seasons'},
          {lbl:season.period + ' DIVISIONS'}
        ]
      } />
    
      {divisions.map((d) => {
      return <DivisionForm division={d} />
      })}

    </div>
  )

}

export default DivisionsPage


