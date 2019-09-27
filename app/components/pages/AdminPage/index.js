import React, { useState, useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { LeagueContext } from '../../Root'

function AdminPage(props) {


  const leagueContext = useContext(LeagueContext);

  return (
    <div>
      <h1>ADMIN</h1>
      <NavLink className='button' to='./seasons'>EDIT SEASONS</NavLink>
    </div>
  )

}

export default AdminPage


