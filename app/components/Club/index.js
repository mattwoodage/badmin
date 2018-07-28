import React, { Component } from 'react'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom'

import styles from './Club.scss'

class Club extends Component {
  render () {

    const { club } = this.props
    console.log(club)
    
    return (
      <NavLink to={`./club/${club._id}`} >
        <b>{club.name}</b><br />
      </NavLink>
    )
  }
}

export default Club
