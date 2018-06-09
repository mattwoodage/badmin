import React, { Component } from 'react'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './Club.scss'

class Club extends Component {
  render () {

    const { club } = this.props
    console.log(club)
    
    return (
      <ListItem>
        <ListItemText secondary={club.website} >
          <b>{club.name}</b>
        </ListItemText>
      </ListItem>
    )
  }
}

export default Club
