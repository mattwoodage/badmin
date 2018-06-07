import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import styles from './Header.scss'
import Button from '@material-ui/core/Button'

class Header extends Component {

  render () {

    return (

      <div className={styles.outer}>

        <h1>{this.props.league}</h1>
        <h2>{this.props.season}</h2>

        <ul>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/home`} >Home</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/calendar`} >Calendar</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/matches`} >Matches</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/tables`} >Tables</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/clubs`} >Clubs</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/players`} >Players</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/admin`} >[ ADMIN ]</NavLink></li>
        </ul>

        <Button variant="contained" color="primary">
      Hello World
    </Button>
    
      </div>

    )
  }
}

export default Header
