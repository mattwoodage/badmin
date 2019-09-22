import React, { Component } from 'react'

import Avatar from '@material-ui/core/Avatar';
import styles from './Player.scss'

import PersonIcon from '@material-ui/icons/Person';

class Player extends Component {

  

  render () {
    const { player } = this.props
    return (
      <div class={`player player-${player.gender}`}>
        <div class='player-icon'><PersonIcon /></div>
        <div class='player-text'><h3>{player.name}</h3></div>
      </div>
    )
  }
}

export default  Player
