import React, { Component } from 'react'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import lightBlue from '@material-ui/core/colors/lightBlue';
import pink from '@material-ui/core/colors/pink';

import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

import PersonIcon from '@material-ui/icons/Person';

const styles = {
  avatar: {
    margin: 5,
  },
  maleAvatar: {
    margin: 0,
    color: '#fff',
    backgroundColor: lightBlue[200],
  },
  femaleAvatar: {
    margin: 0,
    color: '#fff',
    backgroundColor: pink[200],
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
};


class Player extends Component {
  


  renderIcon () {
    const { player, classes } = this.props
    let cls = classes.maleAvatar
    if (player.gender === 'F') cls = classes.femaleAvatar
    return (
      <Avatar className={cls}>
        <PersonIcon />
      </Avatar>
    ) 
  }

  render () {
    const { player } = this.props
    console.log(player)

    return (
      <ListItem>
        {this.renderIcon()}
        <ListItemText secondary={player.gender} >
          <b>{player.name}</b>
        </ListItemText>
      </ListItem>
    )
  }
}

export default  withStyles(styles)(Player)
